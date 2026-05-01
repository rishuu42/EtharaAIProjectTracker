import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
    }
    
    const lowerEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ error: "Invalid credentials." }), { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    
    return new Response(JSON.stringify({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    }), { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Unable to login." }), { status: 500 });
  }
}
