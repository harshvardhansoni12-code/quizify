import { prisma } from "@/lib/prisma";

function generateCode(len = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

export async function POST(request) {
  const body = await request.json();
  const { name, adminId } = body || {};

  if (!name || !adminId) {
    return Response.json(
      { message: "Name and adminId are required" },
      { status: 400 },
    );
  }

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    return Response.json({ message: "Admin not found" }, { status: 404 });
  }

  let code;
  for (let i = 0; i < 6; i++) {
    const candidate = generateCode(6);
    const existing = await prisma.room.findUnique({
      where: { code: candidate },
    });
    if (!existing) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    return Response.json(
      { message: "Could not generate unique room code" },
      { status: 500 },
    );
  }

  const room = await prisma.room.create({ data: { name, code, adminId } });

  return Response.json(
    { message: "Room created", roomId: room.id, code: room.code },
    { status: 201 },
  );
}
