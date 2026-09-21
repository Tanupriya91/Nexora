import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      memberships: {
        include: {
          workspace: true,
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const workspaces = user.memberships.map((membership) => ({
    id: membership.workspace.id,
    name: membership.workspace.name,
    slug: membership.workspace.slug,
    role: membership.role,
  }));

  return NextResponse.json(workspaces);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Workspace name is required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const slug = `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${crypto.randomUUID().slice(0, 8)}`;

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      ownerId: user.id,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  return NextResponse.json(workspace, { status: 201 });
}
