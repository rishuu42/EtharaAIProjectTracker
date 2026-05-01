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
          project: {
            OR: [
              { ownerId: payload.id },
              { members: { some: { userId: payload.id } } }
            ]
          }
        };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const enriched = tasks.map((task) => ({
      ...task,
      project_name: task.project.name,
      assignee_email: task.assignee?.email || ""
    }));

    return new Response(JSON.stringify({ tasks: enriched }), { status: 200 });
  } catch (error) {
    console.error("GET tasks error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks." }), { status: 500 });
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

    const { projectId, title, description, assigneeEmail, dueDate, status, priority } = body;
    if (!projectId || !title) {
      return new Response(JSON.stringify({ error: "Project and title are required." }), { status: 400 });
    }

    let assigneeId = null;
    if (assigneeEmail) {
      const user = await prisma.user.findUnique({
        where: { email: assigneeEmail.toLowerCase() }
      });
      if (!user) {
        return new Response(JSON.stringify({ error: `User with email "${assigneeEmail}" not found. They must sign up first.` }), { status: 400 });
      }
      assigneeId = user.id;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: status || "todo",
        priority: priority || "medium",
        dueDate: (dueDate && !isNaN(new Date(dueDate).getTime())) ? new Date(dueDate) : null,
        projectId,
        assigneeId
      }
    });

    return new Response(JSON.stringify({ success: true, task }), { status: 201 });
  } catch (error) {
    console.error("POST task error:", error);
    return new Response(JSON.stringify({ error: "Failed to create task." }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return new Response(JSON.stringify({ error: "Task id and status are required." }), { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found." }), { status: 404 });
    }

    // Check if user has access to this project
    const isAdmin = payload.role === "admin";
    const isOwner = task.project.ownerId === payload.id;
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: payload.id } }
    });

    if (!isAdmin && !isOwner && !isMember) {
      return new Response(JSON.stringify({ error: "Access denied." }), { status: 403 });
    }

    await prisma.task.update({
      where: { id },
      data: { status }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("PUT task error:", error);
    return new Response(JSON.stringify({ error: "Failed to update task." }), { status: 500 });
  }
}
