'use client'

import { useState } from 'react'
import { StageStatus } from '@prisma/client'
import { recordDecision } from '@/app/actions/clearance.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Check, X, HelpCircle } from 'lucide-react'

export function DecisionForm({ stageId, studentName }: { stageId: string, studentName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [actionType, setActionType] = useState<StageStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!actionType) return

    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('stageId', stageId)
    formData.append('status', actionType)

    const result = await recordDecision(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Decision recorded successfully.')
      setIsOpen(false)
    }
    
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Process
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Clearance: {studentName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col gap-2">
            <Label>Decision</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={actionType === 'APPROVED' ? 'default' : 'outline'}
                className={actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                onClick={() => setActionType('APPROVED')}
              >
                <Check className="w-4 h-4 mr-2" /> Approve
              </Button>
              <Button
                type="button"
                variant={actionType === 'QUERIED' ? 'default' : 'outline'}
                className={actionType === 'QUERIED' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
                onClick={() => setActionType('QUERIED')}
              >
                <HelpCircle className="w-4 h-4 mr-2" /> Query
              </Button>
              <Button
                type="button"
                variant={actionType === 'RETURNED' ? 'default' : 'outline'}
                className={actionType === 'RETURNED' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                onClick={() => setActionType('RETURNED')}
              >
                <X className="w-4 h-4 mr-2" /> Return
              </Button>
            </div>
          </div>

          {(actionType === 'QUERIED' || actionType === 'RETURNED') && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="comment">Comment / Reason <span className="text-red-500">*</span></Label>
              <Input
                id="comment"
                name="comment"
                required
                placeholder={actionType === 'QUERIED' ? 'Why is this queried?' : 'Reason for return'}
              />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!actionType || isLoading}>
              {isLoading ? 'Saving...' : 'Confirm Decision'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
