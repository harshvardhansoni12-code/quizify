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

  try {
    await prisma.roomMember.deleteMany({ where: { roomId } });

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
  } catch (err) {
    return Response.json(
      { message: "Could not delete room", error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
