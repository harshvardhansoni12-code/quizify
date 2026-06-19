import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser({ name, email, password }) {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
}

export const userService = {
  getUserByEmail,
  getUserById,
  createUser,
};
