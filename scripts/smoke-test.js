const base = "http://localhost:3000";

async function req(path, opts = {}) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = text;
  }
  return { status: res.status, body: json };
}

(async () => {
  console.log("GET /api/user/profile");
  console.log(await req("/api/user/profile"));

  console.log("\nPOST /api/user/register");
  const user = await req("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Smoke User",
      email: `smoke.user+${Date.now()}@example.com`,
      password: "pass1234",
    }),
  });
  console.log(user);

  console.log("\nPOST /api/admin/create-admin");
  const admin = await req("/api/admin/create-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Smoke Admin",
      email: `smoke.admin+${Date.now()}@example.com`,
      password: "adminpass",
    }),
  });
  console.log(admin);

  const userId = user.body?.userId || null;
  const adminId = admin.body?.adminId || null;

  if (!adminId) {
    console.log("No adminId, stopping further tests.");
    process.exit(0);
  }

  console.log("\nPOST /api/admin/create-room");
  const room = await req("/api/admin/create-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Smoke Room", adminId }),
  });
  console.log(room);

  const roomId = room.body?.roomId || null;
  const code = room.body?.code || null;

  if (userId && code) {
    console.log("\nPOST /api/user/join-room");
    const join = await req("/api/user/join-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: code, userId }),
    });
    console.log(join);
  }

  if (roomId && adminId) {
    console.log("\nDELETE /api/admin/delete-room");
    const del = await req("/api/admin/delete-room", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, adminId }),
    });
    console.log(del);
  }

  process.exit(0);
})();
