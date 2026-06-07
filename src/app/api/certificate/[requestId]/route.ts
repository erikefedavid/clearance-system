import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient, RequestStatus, Role } from '@prisma/client'
import { generateCertificatePDF } from '@/lib/pdf'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const resolvedParams = await params
  const requestId = resolvedParams.requestId

  try {
    const clearanceRequest = await prisma.clearanceRequest.findUnique({
      where: { id: requestId },
      include: {
        student: true,
        stages: true
      }
    })

    if (!clearanceRequest) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Only the student who owns the request, or a Registry Admin can download the certificate
    if (
      session.user.role === Role.STUDENT &&
      clearanceRequest.student.userId !== session.user.id
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (clearanceRequest.status !== RequestStatus.COMPLETED) {
      return new NextResponse('Clearance not completed', { status: 400 })
    }

    const pdfStream = await generateCertificatePDF(clearanceRequest.student, clearanceRequest)

    // @ts-ignore
    return new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="clearance-certificate-${clearanceRequest.student.matricNumber.replace(/\//g, '-')}.pdf"`,
      }
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
