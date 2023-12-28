import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Ranking from '../components/Ranking'; // Importez le composant Ranking
import prisma from '../lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

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
            image: true,
        },
    });

    const result = userPosts.map((user) => {
        const userCount = userPostCounts.find((count) => count.authorId === user.id);
        const numberOfPublishedPosts = userCount ? userCount._count : 0;
        return {
            userId: user.id,
            userName: user.name,
            userImage: user.image,
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
    userPostCounts: { userId: number; userName: string; userImage: string; numberOfPublishedPosts: number }[];
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
            <div className="ranking-page flex flex-col items-center">
                <div className="ranking-content flex flex-col items-center w-6/12">
                    <div className="ranking-header self-center">
                        <Image
                            className=''
                            src="/images/icon/rank.png"
                            alt="Rank medal"
                            width={300}
                            height={300}
                        />
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Classement des copains !
                        </h1>
                    </div>
                    <div className="ranking-list mt-5 w-full">
                        {userPostCounts.map((user, i) => (
                            <Ranking key={user.userId} user={user} rank={i+1}/>
                        ))}
                    </div>
                </div>
                <p className='text-gray-500 mt-10'>
                <Link href="/create">Tu n'apparais pas dans le classement ? Créer ton premier post ici !</Link>
                </p>
            </div>
        </Layout>
    );
};

export default Rank;