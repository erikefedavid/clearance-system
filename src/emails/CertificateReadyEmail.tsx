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

interface CertificateReadyProps {
  studentName: string
  certificateUrl: string
}

export const CertificateReadyEmail = ({
  studentName = 'Student',
  certificateUrl = 'https://lcu-clearance.com/dashboard',
}: CertificateReadyProps) => {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! Your clearance certificate is ready.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Clearance Completed!</Heading>
          <Text style={text}>Hello {studentName},</Text>
          <Text style={text}>
            Congratulations! All units have approved your clearance request, and your final 
            clearance certificate has been issued by the Registry.
          </Text>

          <Text style={text}>
            You can download your certificate directly from your dashboard using the link below:
          </Text>

          <Link href={certificateUrl} style={button}>
            Download Certificate
          </Link>

          <Text style={footer}>
            Lead City University, Ibadan<br />
            Registry Department
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

const button = {
  backgroundColor: '#16a34a', // Green
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
  maxWidth: '250px',
  margin: '0 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '48px 48px 0',
}
