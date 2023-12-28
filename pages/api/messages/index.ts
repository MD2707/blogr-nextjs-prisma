
import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next" // <--- imported getServerSession from "next-auth/next"
import { options as authOptions } from "../auth/[...nextauth]" // <--- imported authOptions

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions); // <--- used the getServerSession instead
  try {
    const messages = await prisma.message.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}