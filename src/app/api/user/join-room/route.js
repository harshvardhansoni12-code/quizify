import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const body = await request.json();
  const { roomCode, userId } = body || {};

  if (!roomCode || !userId) {
    return Response.json(
      { message: "roomCode and userId are required" },
      { status: 400 },
    );
  }

  const room = await prisma.room.findUnique({ where: { code: roomCode } });
  if (!room) {
    return Response.json({ message: "Room not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const existing = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId: room.id, userId } },
    });
    if (existing) {
      return Response.json({ message: "Already joined" }, { status: 200 });
    }
  } catch (e) {
    // ignore - findUnique may throw if constraint name differs in generated client
  }

  try {
    const member = await prisma.roomMember.create({
      data: { roomId: room.id, userId },
    });
    return Response.json(
      { message: "Joined room", memberId: member.id },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: "Could not join room", error: err.message },
      { status: 500 },
    );
  }
}
