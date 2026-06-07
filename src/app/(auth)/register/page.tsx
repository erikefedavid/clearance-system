import { RegisterForm } from '@/components/forms/RegisterForm'
import Link from 'next/link'
import Image from 'next/image'
import lcuLogo from '../../../../public/lcu-logo.png'
import { ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-bl from-background via-muted/50 to-secondary/10 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-white shadow-xl shadow-secondary/20 rounded-2xl mb-4 border border-border/50">
            <Image src={lcuLogo} alt="LCU Logo" width={60} height={60} className="rounded-xl" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">
            Student Registration
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Create your clearance portal account
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-full -z-10" />
          <RegisterForm />
        </div>

        <div className="text-center text-sm">
          <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
            Already have an account? Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}
