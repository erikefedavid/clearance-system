import { Resend } from 'resend'
import { StageNotificationEmail } from '@/emails/StageNotificationEmail'
import { CertificateReadyEmail } from '@/emails/CertificateReadyEmail'
import { StageStatus } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_prevent_crash')
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lcu-clearance.com'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendStageNotification(
  toEmail: string,
  studentName: string,
  unitName: string,
  status: StageStatus,
  comment?: string | null
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('xxx')) {
    return { success: true, stub: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `LCU Clearance <${fromEmail}>`,
      to: [toEmail],
      subject: `Clearance Update: ${unitName} - ${status}`,
      react: StageNotificationEmail({
        studentName,
        unitName,
        status,
        comment,
        dashboardUrl: `${appUrl}/dashboard`
      })
    })

    if (error) {
      console.error('Resend error:', error)
      return { error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { error }
  }
}

export async function sendCertificateReady(
  toEmail: string,
  studentName: string,
  requestId: string
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('xxx')) {
    return { success: true, stub: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `LCU Registry <${fromEmail}>`,
      to: [toEmail],
      subject: `Clearance Completed - Certificate Ready`,
      react: CertificateReadyEmail({
        studentName,
        certificateUrl: `${appUrl}/api/certificate/${requestId}`
      })
    })

    if (error) {
      console.error('Resend error:', error)
      return { error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { error }
  }
}
