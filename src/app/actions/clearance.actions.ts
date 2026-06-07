'use server'

import { PrismaClient, StageStatus, RequestStatus, Role } from '@prisma/client'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function submitClearance() {
  const session = await auth()
  if (!session || session.user.role !== Role.STUDENT) {
    return { error: 'Unauthorized.' }
  }

  try {
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return { error: 'Student record not found.' }
    }

    const activeRequest = await prisma.clearanceRequest.findFirst({
      where: {
        studentId: student.id,
        status: RequestStatus.IN_PROGRESS
      }
    })

    if (activeRequest) {
      return { error: 'You already have an active clearance request.' }
    }

    await prisma.$transaction(async (tx) => {
      const request = await tx.clearanceRequest.create({
        data: {
          studentId: student.id,
          status: RequestStatus.IN_PROGRESS,
        }
      })

      const units = ['LIBRARY', 'BURSARY', 'DEPARTMENT', 'FACULTY', 'REGISTRY']
      
      for (let i = 0; i < units.length; i++) {
        await tx.clearanceStage.create({
          data: {
            requestId: request.id,
            unitName: units[i],
            unitOrder: i + 1,
            status: StageStatus.PENDING,
          }
        })
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Submit clearance error:', error)
    return { error: 'Failed to submit clearance request.' }
  }
}

export async function recordDecision(formData: FormData) {
  const session = await auth()
  if (!session || (session.user.role !== Role.OFFICER && session.user.role !== Role.REGISTRY)) {
    return { error: 'Unauthorized.' }
  }

  const stageId = formData.get('stageId') as string
  const newStatus = formData.get('status') as StageStatus
  const comment = formData.get('comment') as string

  if (!stageId || !newStatus) {
    return { error: 'Missing required fields.' }
  }

  if ((newStatus === StageStatus.QUERIED || newStatus === StageStatus.RETURNED) && !comment) {
    return { error: 'A comment is required when querying or returning a request.' }
  }

  try {
    const stage = await prisma.clearanceStage.findUnique({
      where: { id: stageId },
      include: { 
        request: {
          include: {
            student: {
              include: { user: true }
            }
          }
        } 
      }
    })

    if (!stage) {
      return { error: 'Stage not found.' }
    }

    // Is Registry override?
    const isRegistryOverride = session.user.role === Role.REGISTRY && newStatus === StageStatus.APPROVED

    if (!isRegistryOverride && session.user.role === Role.OFFICER && session.user.unitName !== stage.unitName) {
      return { error: 'You can only process requests for your unit.' }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update the stage
      await tx.clearanceStage.update({
        where: { id: stageId },
        data: {
          status: newStatus,
          officerId: session.user.id,
          comment: comment || null,
          decidedAt: new Date(),
        }
      })

      // 2. Insert audit log
      await tx.auditLog.create({
        data: {
          stageId: stageId,
          actorId: session.user.id,
          previousStatus: stage.status,
          newStatus: newStatus,
          comment: comment || (isRegistryOverride ? 'Registry Override' : null),
        }
      })

      // 3. Check if all stages are approved to complete the request
      if (newStatus === StageStatus.APPROVED) {
        const allStages = await tx.clearanceStage.findMany({
          where: { requestId: stage.requestId }
        })

        const allApproved = allStages.every(s => s.status === StageStatus.APPROVED)

        if (allApproved) {
          await tx.clearanceRequest.update({
            where: { id: stage.requestId },
            data: { status: RequestStatus.COMPLETED }
          })
          
          // Trigger Certificate Ready Email
          const { sendCertificateReady } = await import('@/lib/email')
          await sendCertificateReady(stage.request.student.user?.email || '', stage.request.student.fullName, stage.requestId)
        }
      }
    })

    // Fetch the student email since it wasn't strictly included in the previous query
    const studentData = await prisma.student.findUnique({
      where: { id: stage.request.studentId },
      include: { user: true }
    })

    if (studentData?.user?.email) {
      const { sendStageNotification } = await import('@/lib/email')
      await sendStageNotification(
        studentData.user.email,
        studentData.fullName,
        stage.unitName,
        newStatus,
        comment
      )
    }

    if (session.user.role === Role.OFFICER) {
      revalidatePath('/officer/dashboard')
    } else {
      revalidatePath('/registry/dashboard')
    }

    return { success: true }
  } catch (error) {
    console.error('Record decision error:', error)
    return { error: 'Failed to record decision.' }
  }
}

export async function issueCertificate(requestId: string) {
  const session = await auth()
  if (!session || session.user.role !== Role.REGISTRY) {
    return { error: 'Unauthorized.' }
  }

  try {
    const req = await prisma.clearanceRequest.findUnique({
      where: { id: requestId },
      include: { student: { include: { user: true } } }
    })

    await prisma.clearanceRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.COMPLETED }
    })
    
    if (req?.student.user?.email) {
      const { sendCertificateReady } = await import('@/lib/email')
      await sendCertificateReady(req.student.user.email, req.student.fullName, requestId)
    }

    revalidatePath('/registry/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Issue certificate error:', error)
    return { error: 'Failed to issue certificate.' }
  }
}
