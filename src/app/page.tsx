"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

import lcuLogo from "../../public/lcu-logo.png"
import dashboardMockup from "../../public/dashboard-mockup.png"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-secondary/30 selection:text-primary">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between z-50 absolute top-0 w-full backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-3">
          <Image src={lcuLogo} alt="LCU Logo" width={40} height={40} className="rounded-md" />
          <span className="font-extrabold text-xl tracking-tight text-primary">LCU Clearance</span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-primary hover:text-primary hover:bg-primary/10">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-32 pb-16 px-6 w-full max-w-7xl mx-auto relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/15 blur-[100px] -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Text Content - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <Badge />
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1]">
              Clearance made <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary">Seamless & Digital.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              Lead City University's modern paperless portal. Track your progress, manage requirements, and instantly download your final certificate.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-transparent">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-background/50 backdrop-blur-md hover:bg-muted transition-transform hover:-translate-y-1 border-2 border-border/50 text-foreground">
                  Create an Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Mockup Image - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex-1 w-full max-w-xl mx-auto lg:mx-0 relative group mt-10 lg:mt-0"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
              {/* Window controls decoration */}
              <div className="h-8 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <Image 
                src={dashboardMockup} 
                alt="Dashboard Preview Mockup" 
                className="w-full h-auto object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 w-full text-left">
          <FeatureCard 
            delay={0.5}
            icon={<CheckCircle2 className="h-10 w-10 text-green-500 mb-4 drop-shadow-md" />}
            title="100% Paperless"
            description="No more walking between units. Submit everything online and track real-time approvals."
          />
          <FeatureCard 
            delay={0.7}
            icon={<Clock className="h-10 w-10 text-primary mb-4 drop-shadow-md" />}
            title="Fast & Transparent"
            description="Know exactly where your clearance is pending. Get notified instantly when units approve or query."
          />
          <FeatureCard 
            delay={0.9}
            icon={<ShieldCheck className="h-10 w-10 text-secondary mb-4 drop-shadow-md" />}
            title="Secure & Verified"
            description="Your final clearance certificate is digitally signed and instantly available for download upon completion."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border/50 bg-muted/10">
        <p className="font-medium text-foreground mb-1">Lead City University, Ibadan</p>
        <p>© {new Date().getFullYear()} Department of Computer Science. All rights reserved.</p>
      </footer>
    </div>
  )
}

function Badge() {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary shadow-sm"
    >
      <span className="relative flex h-2.5 w-2.5 mr-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
      </span>
      Official CS Department Portal
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {icon}
      <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}
