// client/app/components/FutureModels.tsx
'use client'

import { useState } from 'react'

const futureModels = {
  openai: [
    { id: 'gpt-4.1', name: 'GPT-4.1', icon: '🤖' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', icon: '🔹' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 nano', icon: '🔸' },
    { id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', icon: '🚀' },
    { id: 'gpt-4o', name: 'GPT-4o', icon: '⭐' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', icon: '💫' },
    { id: 'o1', name: 'o1', icon: '🎯' },
    { id: 'o1-mini', name: 'o1-mini', icon: '🎪' },
    { id: 'o1-pro', name: 'o1-pro', icon: '🏆' },
    { id: 'o3', name: 'o3', icon: '🔮' },
    { id: 'o3-mini', name: 'o3-mini', icon: '✨' },
    { id: 'o4-mini', name: 'o4-mini', icon: '🌟' },
  ],
  google: [
    { id: 'gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash Preview', icon: '💎' },
    { id: 'gemini-2.5-flash-preview-thinking', name: 'Gemini 2.5 Flash Preview: Thinking', icon: '🧠' },
    { id: 'gemini-2.5-pro-exp-03-25', name: 'Gemini 2.5 Pro Exp 03-25', icon: '💠' },
    { id: 'gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash Lite 001', icon: '⚡' },
    { id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash 001', icon: '🔥' },
    { id: 'gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro Exp 02-05', icon: '🌈' },
    { id: 'gemini-2.0-flash-thinking-exp', name: 'Gemini 2.0 Flash Thinking Exp', icon: '💭' },
    { id: 'gemini-2.0-flash-thinking-exp-1219', name: 'Gemini 2.0 Flash Thinking Exp 1219', icon: '🎄' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp', icon: '🌪️' },
    { id: 'gemini-flash-1.5-8b', name: 'Gemini Flash 1.5 8B', icon: '⚡' },
    { id: 'gemini-flash-1.5-8b-exp', name: 'Gemini Flash 1.5 8B Exp', icon: '🧪' },
    { id: 'gemini-flash-1.5', name: 'Gemini Flash 1.5', icon: '💫' },
    { id: 'gemini-pro-1.5', name: 'Gemini Pro 1.5', icon: '🏅' },
    { id: 'gemini-pro', name: 'Gemini Pro', icon: '💎' },
  ],
  other: [
    { id: 'grok-3-beta', name: 'Grok 3 Beta', icon: '🚀' },
  ]
}

interface FutureModelsProps {
  isExpanded: boolean
  onToggle: () => void
}

export default function FutureModels({ isExpanded }: FutureModelsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  if (!isExpanded) return null

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <div className="text-xs text-gray-500 mb-3 px-3">Скоро доступно:</div>
      
      {/* OpenAI модели */}
      <div className="mb-3">
        <button
          onClick={() => toggleCategory('openai')}
          className="flex items-center justify-between w-full text-left text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span>🤖</span>
            <span>OpenAI ({futureModels.openai.length})</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${expandedCategory === 'openai' ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {expandedCategory === 'openai' && (
          <div className="space-y-1 ml-4">
            {futureModels.openai.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-3 p-2 rounded text-gray-500 text-sm"
              >
                <span>{model.icon}</span>
                <span>{model.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google модели */}
      <div className="mb-3">
        <button
          onClick={() => toggleCategory('google')}
          className="flex items-center justify-between w-full text-left text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span>💎</span>
            <span>Google ({futureModels.google.length})</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${expandedCategory === 'google' ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {expandedCategory === 'google' && (
          <div className="space-y-1 ml-4">
            {futureModels.google.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-3 p-2 rounded text-gray-500 text-sm"
              >
                <span>{model.icon}</span>
                <span className="truncate">{model.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Другие модели */}
      <div>
        <button
          onClick={() => toggleCategory('other')}
          className="flex items-center justify-between w-full text-left text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span>🚀</span>
            <span>Другие ({futureModels.other.length})</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${expandedCategory === 'other' ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {expandedCategory === 'other' && (
          <div className="space-y-1 ml-4">
            {futureModels.other.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-3 p-2 rounded text-gray-500 text-sm"
              >
                <span>{model.icon}</span>
                <span>{model.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
