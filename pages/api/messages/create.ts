
import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next" // <--- imported getServerSession from "next-auth/next"
import { options as authOptions } from "../auth/[...nextauth]" // <--- imported authOptions
import getUserByEmail from '../utils';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions); // <--- used the getServerSession instead
  const { text } = req.body;
  const user = await getUserByEmail(req, res);
  try {
    const newMessage = await prisma.message.create({
      data: {
        userId: user?.id,
        text,
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

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Error creating message', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}