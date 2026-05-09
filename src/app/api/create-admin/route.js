export async function POST(request) {
  const { body } = await request.json();
  const userExists = await prisma.admin.findUnique({
    where: {
      email: body.email,
    },
  });
  if (userExists) {
    return Response.json(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const userCreated = await prisma.admin.create({
    name: body.name,
    email: body.email,
    password: body.password,
  });
  if (!userCreated) {
    return Response.json(JSON.stringify({ message: "User not created" }), {
      status: 500,
    });
  }
  return Response.json(
    JSON.stringify({ message: "User created successfully" }),
    {
      status: 201,
    },
  );
}
