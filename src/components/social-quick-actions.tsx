'use client'

import { useState } from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'

export function SocialQuickActions({
  instagramUrl,
}: {
  instagramUrl: string
}) {
  const [copied, setCopied] = useState(false)
  const username = instagramUrl.replace(/.*instagram\.com\//, '').replace(/\/$/, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instagramUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const dmUrl = `https://www.instagram.com/direct/t/${username}`

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleCopy}
        title="Copy Instagram URL"
        className="flex items-center justify-center size-5.5 rounded border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer"
      >
        {copied ? (
          <Check className="size-3 text-emerald-600" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
      <a
        href={dmUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Message @${username} on Instagram`}
        className="flex items-center justify-center size-5.5 rounded border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer"
      >
        <MessageCircle className="size-3" />
      </a>
    </div>
  )
}
