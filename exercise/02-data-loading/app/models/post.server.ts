import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getPosts() {
  return await prisma.post.findMany();  
}

