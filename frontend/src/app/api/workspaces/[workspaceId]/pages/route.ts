import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type PageRouteProps = {
  params: Promise<{
    workspaceId: string
  }>
}

export async function GET(
  _request: Request,
  { params }: PageRouteProps
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { workspaceId } = await params

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  const membership = await prisma.workspaceMembership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  })

  if (!membership) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    )
  }

  const pages = await prisma.page.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      workspaceId: true,
      parentId: true,
      title: true,
      type: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(pages)
}


export async function POST(
  request: Request,
  { params }: PageRouteProps
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { workspaceId } = await params

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  const membership = await prisma.workspaceMembership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  })

  if (!membership) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    )
  }

  const body = await request.json()
  const title = body.title?.trim()
  const parentId = body.parentId ?? null

  if (!title) {
    return NextResponse.json(
      { error: "Page title is required" },
      { status: 400 }
    )
  }

  if (parentId) {
    const parentPage = await prisma.page.findFirst({
      where: {
        id: parentId,
        workspaceId,
      },
    })

    if (!parentPage) {
      return NextResponse.json(
        { error: "Parent page not found" },
        { status: 404 }
      )
    }
  }

  const page = await prisma.page.create({
    data: {
      workspaceId,
      parentId,
      title,
      type: "DOCUMENT",
      createdById: user.id,
    },
  })

  return NextResponse.json(page, { status: 201 })
}