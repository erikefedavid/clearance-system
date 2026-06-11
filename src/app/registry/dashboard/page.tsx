import { auth } from '@/lib/auth'
import { PrismaClient, RequestStatus, StageStatus } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { DecisionForm } from '@/components/clearance/DecisionForm'
import { issueCertificate } from '@/app/actions/clearance.actions'
import { Button } from '@/components/ui/button'

const prisma = new PrismaClient()

export default async function RegistryDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ search?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== 'REGISTRY') return null

  const resolvedParams = searchParams ? await searchParams : {}
  const search = resolvedParams.search || ''

  const requests = await prisma.clearanceRequest.findMany({
    where: {
      status: RequestStatus.IN_PROGRESS,
      student: search ? {
        matricNumber: { contains: search, mode: 'insensitive' }
      } : undefined
    },
    include: {
      student: true,
      stages: {
        orderBy: { unitOrder: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registry Administration</h1>
          <p className="text-muted-foreground mt-1">Monitor all active clearance requests and issue final certificates.</p>
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Active Clearances</CardTitle>
              <CardDescription>All students currently in progress.</CardDescription>
            </div>
            <form className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search matric no..."
                className="pl-8"
                defaultValue={search}
              />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Matric No</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No active requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => {
                  const approvedCount = req.stages.filter(s => s.status === StageStatus.APPROVED).length
                  const currentStage = req.stages.find(s => s.status === StageStatus.PENDING || s.status === StageStatus.QUERIED || s.status === StageStatus.RETURNED)
                  
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.student.fullName}</TableCell>
                      <TableCell>{req.student.matricNumber}</TableCell>
                      <TableCell>{req.student.programme}</TableCell>
                      <TableCell>
                        {currentStage ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{currentStage.unitName}</span>
                            <Badge variant="secondary" className={
                              currentStage.status === 'QUERIED' ? 'text-orange-600 bg-orange-100' : 
                              currentStage.status === 'RETURNED' ? 'text-red-600 bg-red-100' : ''
                            }>
                              {currentStage.status}
                            </Badge>
                          </div>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">Ready for Registry</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(approvedCount / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{approvedCount}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {currentStage?.unitName === 'REGISTRY' && currentStage.status === StageStatus.PENDING ? (
                          <DecisionForm stageId={currentStage.id} studentName={req.student.fullName} />
                        ) : !currentStage && approvedCount === 5 ? (
                          <form action={async () => {
                            'use server'
                            await issueCertificate(req.id)
                          }}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Issue Certificate</Button>
                          </form>
                        ) : (
                          <span className="text-xs text-muted-foreground">Waiting on unit</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
