'use client'

import { useState } from 'react'
import { loginUser } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    try {
      const result = await loginUser(formData)

      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success('Logged in successfully!')
        // Router is handled by middleware but we can push anyway
        router.refresh()
      }
    } catch (error) {
      // Re-throw all uncaught errors (like NEXT_REDIRECT)
      throw error
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-primary/10 border-0 border-t-4 border-t-primary bg-card/95 backdrop-blur-sm rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle>System Login</CardTitle>
        <CardDescription>Enter your credentials to access the portal.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-4">
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
        </CardContent>
        <CardFooter className="pt-2">
          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
