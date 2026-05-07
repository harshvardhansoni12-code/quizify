export async function POST(request) {
  const { name, email, password } = await request.json();
}
