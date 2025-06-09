// client/app/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import { ClaudeModel } from './ChatInterfaceFixed'

interface SidebarProps {
  selectedModel: ClaudeModel
  onModelChange: (model: ClaudeModel) => void
  onClearChat: () => void
  disabled?: boolean
}

const modelInfo = {
  'claude-opus-4': {
    name: 'Claude Opus 4',
    description: 'Most intelligent model for complex tasks',
    icon: '🧠',
    color: '#8b5cf6',
  },
  'claude-sonnet-4': {
    name: 'Claude Sonnet 4', 
    description: 'Optimal balance of intelligence, cost, and speed',
    icon: '⚡',
    color: '#3b82f6',
  },
}

const additionalModels = [
  { id: 'gpt-4o', name: 'GPT-4o', icon: '🤖', disabled: true },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', icon: '🔹', disabled: true },
  { id: 'o1-preview', name: 'o1-preview', icon: '🎯', disabled: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', icon: '💎', disabled: true },
  { id: 'grok-3', name: 'Grok 3 Beta', icon: '🚀', disabled: true },
]

export default function Sidebar({ selectedModel, onModelChange, onClearChat, disabled }: SidebarProps) {
  const [isModelsExpanded, setIsModelsExpanded] = useState(true)

  return (
    <div className="sidebar">
      {/* Заголовок */}
      <div className="sidebar-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Monica</h1>
            <p className="text-xs text-gray-400">AI Chat Assistant</p>
          </div>
        </div>
      </div>

      {/* Контент боковой панели */}
      <div className="sidebar-content">
        {/* Секция моделей */}
        <div className="mb-6">
          <button
            onClick={() => setIsModelsExpanded(!isModelsExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors mb-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🤖</span>
              <span>Модели</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${isModelsExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {isModelsExpanded && (
            <div className="space-y-1">
              {/* Доступные модели Claude */}
              {(Object.keys(modelInfo) as ClaudeModel[]).map((model) => {
                const info = modelInfo[model]
                const isSelected = selectedModel === model

                return (
                  <button
                    key={model}
                    onClick={() => onModelChange(model)}
                    disabled={disabled}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{info.name}</div>
                        <div className="text-xs opacity-75 truncate">{info.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </button>
                )
              })}

              {/* Недоступные модели */}
              <div className="pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-2 px-3">Скоро доступно:</div>
                {additionalModels.map((model) => (
                  <button
                    key={model.id}
                    disabled
                    className="w-full text-left p-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{model.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{model.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Инструменты */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-purple-400">🛠️</span>
            <span>Инструменты</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={onClearChat}
              disabled={disabled}
              className="w-full text-left p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🗑️</span>
                <span className="text-sm">Очистить чат</span>
              </div>
            </button>
            
            <button
              disabled
              className="w-full text-left p-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🔊</span>
                <span className="text-sm">Text-to-Speech</span>
              </div>
            </button>

            <button
              disabled
              className="w-full text-left p-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <span className="text-sm">Документы</span>
              </div>
            </button>

            <button
              disabled
              className="w-full text-left p-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🎨</span>
                <span className="text-sm">Изображения</span>
              </div>
            </button>
          </div>
        </div>

        {/* Информация */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            <div className="mb-1">Powered by Puter.js</div>
            <div>Claude Opus 4 & Sonnet 4</div>
          </div>
        </div>
      </div>
    </div>
  )
}
