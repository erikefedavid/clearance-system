'use client'

import { logoutUser } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { LogOut, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function Navbar({ userName, userRole }: { userName?: string; userRole: string }) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <GraduationCap className="h-6 w-6" />
          LCU Clearance
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm hidden sm:block">
            <span className="text-muted-foreground mr-2">Logged in as:</span>
            <span className="font-medium">{userName || userRole}</span>
          </div>
          <form action={logoutUser}>
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
