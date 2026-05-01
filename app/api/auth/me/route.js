import prisma from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing token." }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token." }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error("Auth check error:", error);
    return new Response(JSON.stringify({ 
      error: "Authentication failed.", 
      details: error.message 
    }), { status: 500 });
  }
}
