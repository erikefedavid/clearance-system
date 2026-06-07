'use client'

import { useState } from 'react'
import { registerStudent } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      const result = await registerStudent(formData)
  
      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success('Registration successful! Redirecting to dashboard...')
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error // Re-throw to allow Next.js to handle the redirect
      }
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-secondary/10 border-0 border-t-4 border-t-secondary bg-card/95 backdrop-blur-sm rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Create your account to start clearance.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="john.doe@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricNumber">Matriculation Number</Label>
            <Input id="matricNumber" name="matricNumber" required placeholder="LCU/CS/22/001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="programme">Programme</Label>
            <Input id="programme" name="programme" required placeholder="Computer Science" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Input id="faculty" name="faculty" required placeholder="Natural and Applied Sciences" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Input id="level" name="level" type="number" required placeholder="400" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
