'use client'

import { useState } from 'react'
import { registerStudent } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  matricNumber: z.string().min(5, "Matriculation number is required"),
  programme: z.string().min(2, "Programme is required"),
  faculty: z.string().min(2, "Faculty is required"),
  level: z.string().min(1, "Level is required").regex(/^[1-9]00$/, "Level must be a valid level (e.g. 400)"),
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  })

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className={errors.fullName ? "text-red-500" : ""}>Full Name</Label>
            <Input id="fullName" {...register('fullName')} placeholder="John Doe" className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email Address</Label>
            <Input id="email" type="email" {...register('email')} placeholder="john.doe@gmail.com" className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password</Label>
            <Input id="password" type="password" {...register('password')} className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricNumber" className={errors.matricNumber ? "text-red-500" : ""}>Matriculation Number</Label>
            <Input id="matricNumber" {...register('matricNumber')} placeholder="LCU/CS/22/001" className={errors.matricNumber ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.matricNumber && <p className="text-xs text-red-500">{errors.matricNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="programme" className={errors.programme ? "text-red-500" : ""}>Programme</Label>
            <Input id="programme" {...register('programme')} placeholder="Computer Science" className={errors.programme ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.programme && <p className="text-xs text-red-500">{errors.programme.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty" className={errors.faculty ? "text-red-500" : ""}>Faculty</Label>
            <Input id="faculty" {...register('faculty')} placeholder="Natural and Applied Sciences" className={errors.faculty ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.faculty && <p className="text-xs text-red-500">{errors.faculty.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="level" className={errors.level ? "text-red-500" : ""}>Level</Label>
            <Input id="level" type="text" {...register('level')} placeholder="400" className={errors.level ? "border-red-500 focus-visible:ring-red-500" : ""} />
            {errors.level && <p className="text-xs text-red-500">{errors.level.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
