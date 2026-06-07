import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { StageStatus } from '@prisma/client'

interface StageNotificationProps {
  studentName: string
  unitName: string
  status: StageStatus
  comment?: string | null
  dashboardUrl: string
}

export const StageNotificationEmail = ({
  studentName = 'Student',
  unitName = 'LIBRARY',
  status = 'APPROVED',
  comment,
  dashboardUrl = 'https://lcu-clearance.com/dashboard',
}: StageNotificationProps) => {
  const isApproved = status === 'APPROVED'
  const isQueried = status === 'QUERIED'

  const statusColor = isApproved ? '#16a34a' : isQueried ? '#ea580c' : '#dc2626'
  const actionText = isApproved ? 'approved' : isQueried ? 'queried' : 'returned'

  return (
    <Html>
      <Head />
      <Preview>Your {unitName} clearance has been {actionText}.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Clearance Update</Heading>
          <Text style={text}>Hello {studentName},</Text>
          <Text style={text}>
            Your clearance request at the <strong>{unitName}</strong> unit has been{' '}
            <strong style={{ color: statusColor }}>{actionText}</strong>.
          </Text>

          {comment && (
            <Text style={commentBox}>
              <strong>Officer Comment:</strong> {comment}
            </Text>
          )}

          <Text style={text}>
            Please log in to your dashboard to view the full details and next steps.
          </Text>

          <Link href={dashboardUrl} style={button}>
            View Dashboard
          </Link>

          <Text style={footer}>
            Lead City University, Ibadan<br />
            Department of Computer Science
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 48px',
}

const commentBox = {
  backgroundColor: '#f3f4f6',
  padding: '16px',
  margin: '0 48px 16px',
  borderRadius: '4px',
  color: '#374151',
  fontSize: '14px',
}

const button = {
  backgroundColor: '#000',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
  maxWidth: '200px',
  margin: '0 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '48px 48px 0',
}
