// client/app/components/ToolsPanel.tsx
'use client'

interface ToolsPanelProps {
  disabled?: boolean
}

const tools = [
  { id: 'translate', name: 'Перевести', icon: '🌐', disabled: true },
  { id: 'calendar', name: 'Календарь', icon: '📅', disabled: true },
  { id: 'document', name: 'Документ', icon: '📄', disabled: true },
  { id: 'mindmap', name: 'Ментальная карта', icon: '🧠', disabled: true },
  { id: 'mermaid', name: 'Mermaid', icon: '📊', disabled: true },
  { id: 'form', name: 'Форма', icon: '📝', disabled: true },
  { id: 'all', name: 'Все', icon: '⚙️', disabled: true },
]

export default function ToolsPanel({ disabled }: ToolsPanelProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 border-t border-gray-700">
      {tools.map((tool) => (
        <button
          key={tool.id}
          disabled={disabled || tool.disabled}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
          title={tool.name}
        >
          <span className="text-lg">{tool.icon}</span>
          <span className="text-xs font-medium">{tool.name}</span>
        </button>
      ))}
    </div>
  )
}
