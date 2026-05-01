import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

function getUserFromRequest(req) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  return verifyToken(token);
}

export async function GET(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401 });
    }

    const where = payload.role === "admin" 
      ? {} 
      : {
          OR: [
            { ownerId: payload.id },
            { members: { some: { userId: payload.id } } }
          ]
        };

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { email: true } },
        members: { include: { user: { select: { email: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });

    const enriched = projects.map((project) => ({
      ...project,
      owner_email: project.owner.email,
      members_emails: project.members.map(m => m.user.email).join(", ")
    }));

    return new Response(JSON.stringify({ projects: enriched }), { status: 200 });
  } catch (error) {
    console.error("GET projects error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch projects." }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), { status: 400 });
    }

    const { name, description, memberEmails } = body;
    if (!name) {
      return new Response(JSON.stringify({ error: "Project name is required." }), { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        ownerId: payload.id,
      }
    });

    if (memberEmails) {
      const emails = memberEmails
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
      
      if (emails.length > 0) {
        const users = await prisma.user.findMany({
          where: { email: { in: emails } }
        });

        const memberData = users.map(u => ({
          projectId: project.id,
          userId: u.id
        }));

        if (memberData.length > 0) {
          await prisma.projectMember.createMany({
            data: memberData,
            skipDuplicates: true
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, project }), { status: 201 });
  } catch (error) {
    console.error("POST project error:", error);
    return new Response(JSON.stringify({ error: "Failed to create project." }), { status: 500 });
  }
}
