import { deleteRoom } from "@/lib/RoomService";

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
    const deletedCount = await deleteRoom(roomId, adminId);
    if (deletedCount === 0) {
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
