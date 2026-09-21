import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

type WorkspacePageProps = {
  params: Promise<{
    workspaceId: string
  }>
}

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
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
    redirect("/login")
  }

  const membership = await prisma.workspaceMembership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
    include: {
      workspace: true,
    },
  })

  if (!membership) {
    notFound()
  }

  return (
    <main className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <h1 className="text-xl font-semibold">Nexora</h1>

        <nav className="mt-6 space-y-2 text-sm">
          <div className="rounded-md bg-muted px-3 py-2">
            Home
          </div>

          <div className="px-3 py-2 text-muted-foreground">
            Pages
          </div>

          <div className="px-3 py-2 text-muted-foreground">
            Databases
          </div>

          <div className="px-3 py-2 text-muted-foreground">
            Files
          </div>
        </nav>
      </aside>

      <section className="flex-1">
        <header className="flex h-14 items-center border-b px-6">
          <span className="text-sm text-muted-foreground">
            {membership.workspace.name}
          </span>
        </header>

        <div className="p-8">
          <h2 className="text-3xl font-semibold">
            {membership.workspace.name}
          </h2>

          <p className="mt-2 text-muted-foreground">
            Your workspace for pages, databases, files, and knowledge.
          </p>
        </div>
      </section>
    </main>
  )
}