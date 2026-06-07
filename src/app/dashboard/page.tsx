import { auth } from '@/lib/auth'
import { PrismaClient, RequestStatus } from '@prisma/client'
import { submitClearance } from '@/app/actions/clearance.actions'
import { ClearanceTimeline } from '@/components/clearance/ClearanceTimeline'
import { SubmitRequestForm } from '@/components/clearance/SubmitRequestForm'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Send } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function StudentDashboardPage() {
  const session = await auth()
  if (!session) return null

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      requests: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { stages: true }
      }
    }
  })

  if (!student) {
    return <div>Error loading student data.</div>
  }

  const activeRequest = student.requests[0]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clearance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your graduation clearance progress across all units.</p>
        </div>

        {activeRequest?.status === RequestStatus.COMPLETED && (
          <Link href={`/api/certificate/${activeRequest.id}`} className={buttonVariants({ className: "bg-primary shadow-sm hover:shadow-md transition-all" })}>
            <FileText className="mr-2 h-4 w-4" /> Download Certificate
          </Link>
        )}
      </div>

      {!activeRequest ? (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Start Your Clearance</CardTitle>
            <CardDescription>
              Initiate your final graduation clearance process. This will send your request to all 5 required units.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4 pb-8">
            <SubmitRequestForm />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm border flex flex-wrap gap-6 items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Status</p>
              <p className="text-xl font-bold mt-1">
                {activeRequest.status === RequestStatus.COMPLETED ? (
                  <span className="text-green-600">Completed</span>
                ) : activeRequest.status === RequestStatus.REJECTED ? (
                  <span className="text-red-600">Rejected</span>
                ) : (
                  <span className="text-blue-600">In Progress</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Started</p>
              <p className="text-lg font-medium mt-1" suppressHydrationWarning>
                {new Date(activeRequest.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Matric No</p>
              <p className="text-lg font-medium mt-1">{student.matricNumber}</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-6 px-1">Progression Timeline</h2>
          <ClearanceTimeline stages={activeRequest.stages} />
        </div>
      )}
    </div>
  )
}
