'use client'

import { useState } from 'react'
import { loginUser } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
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
      // Handle NEXT_REDIRECT specifically
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error // Re-throw to allow Next.js to handle the redirect
      }
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-primary/10 border-0 border-t-4 border-t-primary bg-card/95 backdrop-blur-sm rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle>System Login</CardTitle>
        <CardDescription>Enter your credentials to access the portal.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="john.doe@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
