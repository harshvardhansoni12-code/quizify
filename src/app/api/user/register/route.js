import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const body = await request.json();
  const { name, email, password } = body || {};

  if (!email || !password) {
    return Response.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return Response.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  const userCreated = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!userCreated) {
    return Response.json({ message: "User not created" }, { status: 500 });
  }

  return Response.json(
    { message: "User created successfully", userId: userCreated.id },
    { status: 201 },
  );
}
