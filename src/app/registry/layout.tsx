import { auth } from '@/lib/auth'
import { Navbar } from '@/components/shared/Navbar'
import { redirect } from 'next/navigation'

export default async function RegistryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== 'REGISTRY') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userName="Registry Admin" userRole="Registry" />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
