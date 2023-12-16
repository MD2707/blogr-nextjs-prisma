// pages/api/post/index.ts
// import { getSession } from 'next-auth/react'; // <--- removed getSession import
import { getServerSession } from "next-auth/next" // <--- imported getServerSession from "next-auth/next"
import { options as authOptions } from "../auth/[...nextauth]" // <--- imported authOptions
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;

  // const session = await getSession({ req }); // <--- removed getSession call
  const session = await getServerSession(req, res, authOptions); // <--- used the getServerSession instead
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}