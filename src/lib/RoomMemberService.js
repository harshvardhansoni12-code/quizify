import { prisma } from "@/lib/prisma";

export async function getRoomMemberById(id) {
  return prisma.roomMember.findUnique({ where: { id } });
}

export async function getRoomMembers(roomId) {
  return prisma.roomMember.findMany({
    where: { roomId },
    include: { user: true },
  });
}

export async function getUserRooms(userId) {
  return prisma.roomMember.findMany({
    where: { userId },
    include: { room: true },
  });
}

export async function checkMembership(roomId, userId) {
  try {
    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    return !!member;
  } catch (e) {
    // Constraint name may differ in generated client
    return false;
  }
}

export async function joinRoom(roomId, userId) {
  const existing = await checkMembership(roomId, userId);
  if (existing) {
    return prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
  }

  return prisma.roomMember.create({
    data: { roomId, userId },
  });
}

export async function removeMember(roomId, userId) {
  return prisma.roomMember.deleteMany({
    where: { roomId, userId },
  });
}

export const roomMemberService = {
  getRoomMemberById,
  getRoomMembers,
  getUserRooms,
  checkMembership,
  joinRoom,
  removeMember,
};
