import { auth } from '@/lib/auth'
import { PrismaClient, StageStatus } from '@prisma/client'
import { DecisionForm } from '@/components/clearance/DecisionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const prisma = new PrismaClient()

export default async function OfficerDashboardPage() {
  const session = await auth()
  if (!session || !session.user.unitName) return null

  const myPendingStages = await prisma.clearanceStage.findMany({
    where: {
      unitName: session.user.unitName,
      status: StageStatus.PENDING,
      request: {
        status: 'IN_PROGRESS'
      }
    },
    include: {
      request: {
        include: {
          student: true,
          stages: {
            orderBy: { unitOrder: 'asc' }
          }
        }
      }
    },
    orderBy: { request: { createdAt: 'asc' } }
  })

  const availableStages = myPendingStages.filter(stage => {
    const previousStages = stage.request.stages.filter(s => s.unitOrder < stage.unitOrder)
    return previousStages.every(s => s.status === StageStatus.APPROVED)
  })

  const recentHistory = await prisma.clearanceStage.findMany({
    where: {
      unitName: session.user.unitName,
      officerId: session.user.id,
      status: { not: StageStatus.PENDING }
    },
    include: {
      request: {
        include: { student: true }
      }
    },
    orderBy: { decidedAt: 'desc' },
    take: 10
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unit Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage clearance requests for the <span className="font-semibold text-primary">{session.user.unitName}</span> unit.</p>
        </div>
        <form action={async () => {
          'use server'
          const { logoutUser } = await import('@/app/actions/auth.actions')
          await logoutUser()
        }}>
          <Button type="submit" variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
            Log out
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Queue</CardTitle>
          <CardDescription>Requests waiting for your decision.</CardDescription>
        </CardHeader>
        <CardContent>
          {availableStages.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              No pending requests in your queue.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric No</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableStages.map((stage) => (
                  <TableRow key={stage.id}>
                    <TableCell className="font-medium">{stage.request.student.fullName}</TableCell>
                    <TableCell>{stage.request.student.matricNumber}</TableCell>
                    <TableCell>{stage.request.student.programme}</TableCell>
                    <TableCell>{new Date(stage.request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DecisionForm stageId={stage.id} studentName={stage.request.student.fullName} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {recentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
            <CardDescription>Your last 10 processed requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6 rounded-r-md text-sm text-muted-foreground flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-5 h-5 text-primary shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <div>
                <strong className="text-foreground block mb-1">Reprocessing Rejected Students</strong>
                If you previously marked a student as <span className="text-red-500 font-semibold">RETURNED</span> or <span className="text-orange-500 font-semibold">QUERIED</span>, you can change their status back to Approved by clicking the <strong>Process</strong> button next to their name below once they resolve the issue.
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric No</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.map((stage) => (
                  <TableRow key={stage.id}>
                    <TableCell className="font-medium">{stage.request.student.fullName}</TableCell>
                    <TableCell>{stage.request.student.matricNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        stage.status === 'APPROVED' ? 'text-green-600 border-green-200 bg-green-50' :
                        stage.status === 'QUERIED' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                        'text-red-600 border-red-200 bg-red-50'
                      }>
                        {stage.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{stage.decidedAt ? new Date(stage.decidedAt).toLocaleDateString() : ''}</TableCell>
                    <TableCell className="text-right">
                      {stage.status !== 'APPROVED' && (
                        <DecisionForm stageId={stage.id} studentName={stage.request.student.fullName} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
