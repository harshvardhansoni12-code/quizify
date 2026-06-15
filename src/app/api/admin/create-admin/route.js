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

  const adminExists = await prisma.admin.findUnique({ where: { email } });
  if (adminExists) {
    return Response.json({ message: "Admin already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  try {
    const adminCreated = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!adminCreated) {
      return Response.json({ message: "Admin not created" }, { status: 500 });
    }

    return Response.json(
      { message: "Admin created successfully", adminId: adminCreated.id },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: "Admin creation failed", error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
