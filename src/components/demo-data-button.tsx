'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateDemoData } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function DemoDataButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!confirm('This will generate sample brands, campaigns, and influencers. Continue?')) return
    
    setLoading(true)
    try {
      await generateDemoData()
      router.refresh()
      alert('Demo data generated successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to generate demo data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20 cursor-pointer"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      {loading ? 'Generating...' : 'Generate Demo Data'}
    </Button>
  )
}
