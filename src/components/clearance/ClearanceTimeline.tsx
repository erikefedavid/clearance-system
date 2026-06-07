import { StageStatus, ClearanceStage } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

function getStatusIcon(status: StageStatus) {
  switch (status) {
    case 'APPROVED': return <CheckCircle2 className="h-6 w-6 text-green-500" />
    case 'PENDING': return <Clock className="h-6 w-6 text-yellow-500" />
    case 'QUERIED': return <AlertCircle className="h-6 w-6 text-orange-500" />
    case 'RETURNED': return <XCircle className="h-6 w-6 text-red-500" />
  }
}

function getStatusColor(status: StageStatus) {
  switch (status) {
    case 'APPROVED': return 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
    case 'PENDING': return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
    case 'QUERIED': return 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20'
    case 'RETURNED': return 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
  }
}

export function ClearanceTimeline({ stages }: { stages: ClearanceStage[] }) {
  // Sort stages by order
  const sortedStages = [...stages].sort((a, b) => a.unitOrder - b.unitOrder)

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {sortedStages.map((stage, index) => (
        <div key={stage.id} className="relative flex items-start gap-6 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-background shadow shrink-0 z-10 relative">
            {getStatusIcon(stage.status)}
          </div>
          <div className="flex-1 p-5 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-lg tracking-tight">{stage.unitName}</h3>
              <Badge className={`w-fit ${getStatusColor(stage.status)}`} variant="secondary">
                {stage.status}
              </Badge>
            </div>
            {stage.decidedAt && (
              <p className="text-xs text-muted-foreground mb-3" suppressHydrationWarning>
                Processed on {format(new Date(stage.decidedAt), 'PPP p')}
              </p>
            )}
            {stage.comment && (
              <div className="mt-3 p-4 bg-muted/30 rounded-lg border text-sm">
                <span className="font-semibold block mb-1">Officer Comment:</span>
                <span className="text-muted-foreground italic">"{stage.comment}"</span>
              </div>
            )}
            {!stage.decidedAt && stage.status === 'PENDING' && (
              <p className="text-sm text-muted-foreground mt-1">
                Awaiting review from the {stage.unitName.toLowerCase()} unit.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
