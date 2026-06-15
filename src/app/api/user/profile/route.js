import { getServerSession } from "next-auth";
import { userAuthOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(userAuthOptions);

  if (!session?.user || session.user.role !== "user") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ session }, { status: 200 });
}
