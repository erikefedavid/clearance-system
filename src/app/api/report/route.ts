import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient, RequestStatus, Role } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== Role.REGISTRY) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const format = searchParams.get('format') || 'csv'

  let dateFilter = {}
  if (from || to) {
    dateFilter = {
      updatedAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {})
      }
    }
  }

  try {
    const completedRequests = await prisma.clearanceRequest.findMany({
      where: {
        status: RequestStatus.COMPLETED,
        ...dateFilter
      },
      include: {
        student: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    if (format === 'csv') {
      const headers = 'Matriculation Number,Full Name,Programme,Faculty,Clearance Date\n'
      const rows = completedRequests.map(req => {
        return `"${req.student.matricNumber}","${req.student.fullName}","${req.student.programme}","${req.student.faculty}","${req.updatedAt.toISOString()}"`
      }).join('\n')

      return new NextResponse(headers + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="clearance-report.csv"',
        }
      })
    }

    // PDF report not fully implemented in this minimal version, falling back to CSV
    return new NextResponse('PDF format not supported yet. Use format=csv.', { status: 400 })
    
  } catch (error) {
    console.error('Report Generation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
