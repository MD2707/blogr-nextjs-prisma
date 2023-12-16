
import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next" // <--- imported getServerSession from "next-auth/next"
import { options as authOptions } from "../auth/[...nextauth]" // <--- imported authOptions

export default async function handler(req, res) {
  const { postId, content } = req.body;
  const session = await getServerSession(req, res, authOptions); // <--- used the getServerSession instead

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });


  try {
    const reaction = await prisma.reaction.create({
      data: {
        content,
        postId,
        userId: user?.id,
      },
    });
    res.status(200).json(reaction);
  } catch (error) {
    console.error('Erreur lors de la création de la réaction', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réaction' });
  }
}