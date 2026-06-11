'use server'

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function registerStudent(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const matricNumber = formData.get('matricNumber') as string
    const programme = formData.get('programme') as string
    const faculty = formData.get('faculty') as string
    const levelStr = formData.get('level') as string

    if (!email || !password || !fullName || !matricNumber || !programme || !faculty || !levelStr) {
      return { error: 'All fields are required.' }
    }


    const level = parseInt(levelStr)
    if (isNaN(level)) {
      return { error: 'Level must be a number.' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: 'User with this email already exists.' }
    }

    const existingStudent = await prisma.student.findUnique({
      where: { matricNumber }
    })

    if (existingStudent) {
      return { error: 'Student with this matriculation number already exists.' }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: Role.STUDENT,
        }
      })

      await tx.student.create({
        data: {
          userId: user.id,
          fullName,
          matricNumber,
          programme,
          faculty,
          level,
        }
      })
    })


    // Auto-login the user immediately after successful registration
    return await loginUser(formData)
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Registration error:', error)
    return { error: 'An unexpected error occurred during registration.' }
  }
}

export async function loginUser(formData: FormData) {
  const { signIn } = await import('@/lib/auth')
  
  // Find the user to determine the correct dashboard path
  const email = formData.get('email') as string
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  let redirectTo = '/dashboard' // Default for STUDENT
  if (user) {
    if (user.role === 'OFFICER') redirectTo = '/officer/dashboard'
    if (user.role === 'REGISTRY') redirectTo = '/registry/dashboard'
  }

  try {
    await signIn('credentials', { ...Object.fromEntries(formData), redirectTo })
    return { success: true }
  } catch (error: any) {
    // NextAuth throws AuthError for auth failures
    if (error.name === 'CredentialsSignin' || error.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password.' }
    }
    if (error.name === 'AuthError') {
      return { error: 'An unexpected authentication error occurred.' }
    }
    // Must re-throw Next.js redirect errors
    throw error
  }
}

export async function logoutUser() {
  const { signOut } = await import('@/lib/auth')
  await signOut({ redirectTo: '/login' })
}
