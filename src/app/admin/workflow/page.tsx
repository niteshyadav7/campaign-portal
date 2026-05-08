import { ArrowRightLeft, Building2, CheckCircle2, Target, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader, PageSurface } from '@/components/premium-ui'

export default function WorkflowPage() {
  const steps = [
    {
      phase: 'Step 1',
      title: 'Foundation and onboarding',
      items: [
        'Create a brand workspace for each client.',
        'Invite client users with the right credentials.',
        'Build the master influencer database.',
        'Launch a campaign for the selected brand.',
      ],
      icon: Building2,
      tone: 'bg-violet-600',
    },
    {
      phase: 'Step 2',
      title: 'Curate the pitch',
      items: [
        'Open the campaign workspace.',
        'Add influencers from the master pool.',
        'Share creator recommendations as pending cards.',
        'Move the review into the client portal.',
      ],
      icon: Target,
      tone: 'bg-sky-600',
    },
    {
      phase: 'Step 3',
      title: 'Client review',
      items: [
        'Client logs into their brand workspace.',
        'Only their campaigns and team are visible.',
        'They shortlist or reject each creator.',
        'Every decision is captured with user context.',
      ],
      icon: Users,
      tone: 'bg-emerald-600',
    },
    {
      phase: 'Step 4',
      title: 'Decision loop',
      items: [
        'Agency sees decisions as soon as pages refresh.',
        'No spreadsheet versions or chat confusion.',
        'Approved talent is ready for contracting.',
        'The same flow scales across many brands.',
      ],
      icon: ArrowRightLeft,
      tone: 'bg-rose-600',
    },
  ]

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Operating model"
        title="The modern workflow"
        description="A clear end-to-end path for setting up brands, pitching creators, and capturing client decisions."
      />

      <div className="grid grid-cols-1 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <div key={step.phase} className="relative">
              {index !== steps.length - 1 ? (
                <div className="absolute bottom-[-24px] left-8 top-16 hidden w-px bg-slate-200 md:block" />
              ) : null}
              <div className="relative z-10 flex flex-col gap-5 md:flex-row">
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${step.tone}`}>
                  <Icon className="size-7" />
                </div>
                <Card className="flex-1 border-white/70 bg-white/90 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase text-teal-700">
                        {step.phase}
                      </span>
                      <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
                    </div>
                    <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-white/80 bg-white/[0.84] p-8 text-center text-slate-800 shadow-sm">
        <h2 className="bg-gradient-to-r from-teal-700 to-sky-600 bg-clip-text text-2xl font-semibold tracking-normal text-transparent">Eliminate spreadsheet drift</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Keep creator recommendations, approvals, rejections, and audit context in one branded portal.
        </p>
      </div>
    </PageSurface>
  )
}
