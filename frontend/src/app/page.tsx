import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      },
    },
  })

  if (!user || user.memberships.length === 0) {
    redirect("/workspace/new")
  }

  redirect(`/workspace/${user.memberships[0].workspaceId}`)
}