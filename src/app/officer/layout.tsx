import { auth } from '@/lib/auth'
import { Navbar } from '@/components/shared/Navbar'
import { redirect } from 'next/navigation'

export default async function OfficerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== 'OFFICER') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userName={`${session.user.unitName} Officer`} userRole="Officer" />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
