import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Ranking from '../components/Ranking'; // Importez le composant Ranking
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 403;
        return { props: { userPostCounts: [] } };
    }

    const userPostCounts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
            published: true,
        },
        _count: true,
    });

    const userPosts = await prisma.user.findMany({
        where: {
            id: { in: userPostCounts.map((userCount) => userCount.authorId) },
        },
        select: {
            id: true,
            name: true,
        },
    });

    const result = userPosts.map((user) => {
        const userCount = userPostCounts.find((count) => count.authorId === user.id);
        const numberOfPublishedPosts = userCount ? userCount._count : 0;
        return {
            userId: user.id,
            userName: user.name,
            numberOfPublishedPosts,
        };
    });

    return {
        props: {
            userPostCounts: result,
        },
    };
};

type Props = {
    userPostCounts: { userId: number; userName: string; numberOfPublishedPosts: number }[];
};

const Rank: React.FC<Props> = ({ userPostCounts }) => {
    const { data: session } = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>Ranking</h1>
                <div>You need to be authenticated to view this page.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page">
                <h1>Ranking</h1>
                <Ranking userPostCounts={userPostCounts} />
            </div>
            <style jsx>{`
                /* Ajoutez vos styles ici */
            `}</style>
        </Layout>
    );
};

export default Rank;