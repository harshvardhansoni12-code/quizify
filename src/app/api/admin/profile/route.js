import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);

  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ session }, { status: 200 });
}
