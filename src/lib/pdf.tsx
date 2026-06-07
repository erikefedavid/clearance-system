import { Document, Page, Text, View, StyleSheet, renderToStream, Image as PDFImage } from '@react-pdf/renderer'
import { Student, ClearanceRequest, StageStatus } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Read the logo synchronously to use as base64
const logoPath = path.join(process.cwd(), 'public/lcu-logo.png')
let logoBase64 = ''
try {
  const logoBuffer = fs.readFileSync(logoPath)
  logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
} catch (e) {
  console.error('Failed to load logo for PDF', e)
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  watermark: {
    width: 400,
    opacity: 0.05,
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '3 solid #1a365d',
    zIndex: -2,
  },
  innerBorder: {
    position: 'absolute',
    top: 25,
    left: 25,
    right: 25,
    bottom: 25,
    border: '1 solid #1a365d',
    zIndex: -2,
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  university: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a365d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  department: {
    fontSize: 14,
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2b6cb0',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  detailsContainer: {
    marginBottom: 40,
    padding: 25,
    backgroundColor: 'rgba(247, 250, 252, 0.8)',
    borderRadius: 8,
    marginHorizontal: 30,
    borderLeft: '4 solid #2b6cb0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    width: 160,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 1.8,
    marginBottom: 40,
    marginHorizontal: 30,
    textAlign: 'justify',
    color: '#2d3748',
  },
  signatureContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
  },
  signatureBlock: {
    width: 180,
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: '1 solid #1a365d',
    marginTop: 40,
    paddingTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  signatureText: {
    fontStyle: 'italic',
    marginBottom: 10,
    fontSize: 11,
    color: '#4a5568',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#a0aec0',
  }
})

export async function generateCertificatePDF(
  student: Student,
  request: ClearanceRequest & { stages: any[] }
) {
  const clearanceDate = request.updatedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Ensure all stages were approved
  const allApproved = request.stages.length === 5 && request.stages.every(s => s.status === StageStatus.APPROVED)
  
  if (!allApproved) {
    throw new Error('Cannot generate certificate: Clearance is not fully approved.')
  }

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border} />
        <View style={styles.innerBorder} />

        {logoBase64 && (
          <View style={styles.watermarkContainer}>
            <PDFImage src={logoBase64} style={styles.watermark} />
          </View>
        )}

        <View style={styles.header}>
          {logoBase64 && <PDFImage src={logoBase64} style={styles.logo} />}
          <Text style={styles.university}>Lead City University</Text>
          <Text style={styles.department}>Department of Computer Science</Text>
        </View>

        <Text style={styles.title}>Final Clearance Certificate</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Student Name:</Text>
            <Text style={styles.value}>{student.fullName.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Matriculation No:</Text>
            <Text style={styles.value}>{student.matricNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Programme:</Text>
            <Text style={styles.value}>{student.programme}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Faculty:</Text>
            <Text style={styles.value}>{student.faculty}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Issue:</Text>
            <Text style={styles.value}>{clearanceDate}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          This is to certify that the above-named student has successfully completed the rigorous graduation clearance process 
          across all required administrative units including the Library, Bursary, Department, Faculty, and Registry. 
          The student is hereby cleared of all academic and financial obligations to the university and is approved for graduation.
        </Text>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>{clearanceDate}</Text>
            <Text style={styles.signatureLine}>Date</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Digitally Signed</Text>
            <Text style={styles.signatureLine}>Registry Officer</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This is an official document generated by the LCU Online Student Clearance System. 
          Reference ID: {request.id}
        </Text>
      </Page>
    </Document>
  )

  const stream = await renderToStream(<MyDocument />)
  return stream
}
