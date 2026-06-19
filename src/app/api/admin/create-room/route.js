import { prisma } from "@/lib/prisma";
import { createRoom } from "@/lib/RoomService";

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

  try {
    const room = await createRoom({ name, adminId });
    return Response.json(
      { message: "Room created", roomId: room.id, code: room.code },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: "Could not create room", error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
