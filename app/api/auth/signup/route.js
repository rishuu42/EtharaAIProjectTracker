import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: "Email and a password of at least 6 characters are required." }), { status: 400 });
    }
    
    const lowerEmail = email.toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered." }), { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || "",
        email: lowerEmail,
        password: hashed,
        role: "member",
      },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    
    return new Response(JSON.stringify({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    }), { status: 201 });
  } catch (error) {
    console.error("Signup error details:", error);
    return new Response(JSON.stringify({ 
      error: "Unable to signup.", 
      details: error.message 
    }), { status: 500 });
  }
}
