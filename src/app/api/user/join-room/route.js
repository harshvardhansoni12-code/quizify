import { prisma } from "@/lib/prisma";
import { joinRoom } from "@/lib/RoomMemberService";
import { getRoomByCode } from "@/lib/RoomService";

export async function POST(request) {
  const body = await request.json();
  const { roomCode, userId } = body || {};

  if (!roomCode || !userId) {
    return Response.json(
      { message: "roomCode and userId are required" },
      { status: 400 },
    );
  }

  const room = await getRoomByCode(roomCode);
  if (!room) {
    return Response.json({ message: "Room not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const member = await joinRoom(room.id, userId);
    const statusCode = member.joinedAt ? 201 : 200;
    const message = member.joinedAt ? "Joined room" : "Already joined";
    return Response.json(
      { message, memberId: member.id },
      { status: statusCode },
    );
  } catch (err) {
    return Response.json(
      { message: "Could not join room", error: err.message },
      { status: 500 },
    );
  }
}
