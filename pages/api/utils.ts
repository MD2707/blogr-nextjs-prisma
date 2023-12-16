
import { getServerSession } from "next-auth/next" // <--- imported getServerSession from "next-auth/next"
import { options as authOptions } from "../api/auth/[...nextauth]" // <--- imported authOptions
import prisma from "../../lib/prisma";


export default async function getUserByEmail(req, res) {
    const session = await getServerSession(req, res, authOptions); // <--- used the getServerSession instead

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email,
        },
    });
    return user;
}