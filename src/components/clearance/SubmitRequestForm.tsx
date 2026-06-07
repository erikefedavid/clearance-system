'use client'

import { useState } from 'react'
import { submitClearance } from '@/app/actions/clearance.actions'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

export function SubmitRequestForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const result = await submitClearance()
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Clearance request submitted successfully!')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <Button type="submit" size="lg" className="px-8 shadow-md transition-all hover:scale-105" disabled={isLoading}>
        <Send className="mr-2 h-4 w-4" /> 
        {isLoading ? 'Submitting...' : 'Submit Clearance Request'}
      </Button>
    </form>
  )
}
