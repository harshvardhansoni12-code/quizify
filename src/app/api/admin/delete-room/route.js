import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  const body = await request.json();
  const { roomId, adminId } = body || {};

  if (!roomId || !adminId) {
    return Response.json(
      { message: "roomId and adminId are required" },
      { status: 400 },
    );
  }

  const deleted = await prisma.room.deleteMany({
    where: { id: roomId, adminId },
  });
  if (deleted.count === 0) {
    return Response.json(
      { message: "Room not found or not owned by admin" },
      { status: 404 },
    );
  }

  return Response.json({ message: "Room deleted" }, { status: 200 });
}
