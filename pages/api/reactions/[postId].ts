import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { postId } = req.query;

  try {
    const reactions = await prisma.reaction.findMany({
      where: {
        postId,
      },
    });

    res.status(200).json(reactions);
  } catch (error) {
    console.error('Erreur lors de la récupération des réactions', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réactions' });
  }
}