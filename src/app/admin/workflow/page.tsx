import { Card, CardContent } from '@/components/ui/card'
import { Building2, Target, Users, LogOut, ArrowRightLeft, CheckCircle2 } from 'lucide-react'

export default function WorkflowPage() {
  const steps = [
    {
      phase: '🏢 Step 1: Agency Admin Setup',
      title: 'Foundation & Onboarding',
      items: [
        'Create a Brand: Add your clients (e.g., "Nike") in the Brands tab.',
        'Onboard the Client: Create their credentials (client@nike.com).',
        'Build Influencer Pool: Add your master database of influencers.',
        'Launch Campaign: Create a "Summer Launch" for that specific brand.'
      ],
      icon: <Building2 className="w-6 h-6 text-violet-400" />,
      color: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      phase: '🎯 Step 2: The Pitch',
      title: 'Curating Talent',
      items: [
        'Open the campaign to see your blank canvas.',
        'Click "Add Influencer" and pick talent from your master pool.',
        'Pitch your suggestions: They appear as cards with a "Pending" badge.',
        'The agency\'s work is done—the ball is now in the client\'s court.'
      ],
      icon: <Target className="w-6 h-6 text-blue-400" />,
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      phase: '🤝 Step 3: Client Experience',
      title: 'Professional Review Portal',
      items: [
        'Log out and log in as the Client (client@nike.com).',
        'Experience the Branded UI: No pool access, no other brands visible.',
        'Review & Decide: Client clicks "✓ Shortlist" or "✗ Reject".',
        'Audit Trail: Every click is logged with a user timestamp.'
      ],
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      phase: '🔄 Step 4: The Loop Closes',
      title: 'Real-Time Sync',
      items: [
        'Agency logs back in and sees decisions instantly.',
        'No spreadsheets, no WhatsApp threads, no confusion.',
        'Proceed directly to contracting the approved talent.',
        'Scale your agency by managing 100+ brands with ease.'
      ],
      icon: <ArrowRightLeft className="w-6 h-6 text-rose-400" />,
      color: 'bg-rose-500/10 border-rose-500/20'
    }
  ]

  return (
    <div className="space-y-12 pb-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">The Modern Workflow</h1>
        <p className="text-zinc-500 mt-4 text-lg leading-relaxed">
          This portal replaces manual spreadsheets with a professional, multi-tenant SaaS experience. 
          Follow these steps to experience the complete end-to-end flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {index !== steps.length - 1 && (
              <div className="absolute left-9 top-20 bottom-0 w-px bg-gradient-to-b from-zinc-200 to-transparent z-0 hidden md:block" />
            )}
            
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className={`flex-shrink-0 w-18 h-18 rounded-2xl ${step.color} border flex items-center justify-center shadow-lg shadow-black/5`}>
                {step.icon}
              </div>
              
              <Card className="flex-1 bg-white border-zinc-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                      {step.phase}
                    </span>
                    <h3 className="text-xl font-semibold text-zinc-900">{step.title}</h3>
                  </div>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-1 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-zinc-500 group-hover:text-zinc-800 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-50 via-blue-50 to-emerald-50 border border-zinc-100 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-3">Eliminate the Spreadsheet Chaos</h2>
        <p className="text-zinc-600 max-w-2xl mx-auto text-lg italic">
          "This workflow eliminates the need for sending Excel sheets back and forth, giving your agency a highly professional, white-labeled software experience."
        </p>
      </div>
    </div>
  )
}
