import { ShieldCheck } from 'lucide-react'

const ThreatProtectDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-tmobile p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Threat Protect</h1>
          <p className="text-lg opacity-90">
            Always-On Protection Across All Devices & Networks
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <ShieldCheck className="w-full h-full" />
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">Threat Protect Dashboard</h3>
        <p className="text-muted-foreground">
          Real-time endpoint protection, VPN security, and malicious site blocking
        </p>
      </div>
    </div>
  )
}

export default ThreatProtectDashboard

