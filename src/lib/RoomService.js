import { prisma } from "@/lib/prisma";

const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_ATTEMPTS = 10;
const ROOM_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(len = ROOM_CODE_LENGTH) {
  let code = "";
  for (let i = 0; i < len; i += 1) {
    code += ROOM_CODE_CHARS.charAt(
      Math.floor(Math.random() * ROOM_CODE_CHARS.length),
    );
  }
  return code;
}

async function generateUniqueRoomCode() {
  for (let i = 0; i < ROOM_CODE_ATTEMPTS; i += 1) {
    const candidate = generateCode();
    const existing = await prisma.room.findUnique({
      where: { code: candidate },
    });
    if (!existing) {
      return candidate;
    }
  }
  throw new Error("Could not generate unique room code");
}

export async function getRoomById(id) {
  return prisma.room.findUnique({ where: { id } });
}

export async function getRoomByCode(code) {
  return prisma.room.findUnique({ where: { code } });
}

export async function getRoomsByAdmin(adminId) {
  return prisma.room.findMany({ where: { adminId } });
}

export async function createRoom({ name, adminId }) {
  const code = await generateUniqueRoomCode();
  return prisma.room.create({ data: { name, code, adminId } });
}

export async function deleteRoom(roomId, adminId) {
  const [, deletedRoom] = await prisma.$transaction([
    prisma.roomMember.deleteMany({ where: { roomId } }),
    prisma.room.deleteMany({ where: { id: roomId, adminId } }),
  ]);

  return deletedRoom.count;
}

export const roomService = {
  getRoomById,
  getRoomByCode,
  getRoomsByAdmin,
  createRoom,
  deleteRoom,
};
