// client/app/components/TextToSpeech.tsx
'use client'

import { useState } from 'react'

interface TextToSpeechProps {
  text: string
  disabled?: boolean
}

declare global {
  interface Window {
    puter: {
      ai: {
        txt2speech: (text: string, options?: { voice?: string }) => Promise<Blob>
      }
    }
  }
}

export default function TextToSpeech({ text, disabled }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleTextToSpeech = async () => {
    if (!text.trim() || disabled || !window.puter?.ai?.txt2speech) return

    try {
      setIsLoading(true)
      
      // Используем Puter.js Text-to-Speech API
      const audioBlob = await window.puter.ai.txt2speech(text, {
        voice: 'alloy' // Можно выбрать: alloy, echo, fable, onyx, nova, shimmer
      })

      // Создаем URL для аудио
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      setIsPlaying(true)

      // Воспроизводим аудио
      audio.play()

      // Обработчики событий
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
        console.error('Ошибка воспроизведения аудио')
      }

    } catch (error) {
      console.error('Ошибка Text-to-Speech:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleTextToSpeech}
      disabled={disabled || isLoading || !text.trim()}
      className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Озвучить текст"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      ) : isPlaying ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h4v.5a.5.5 0 001 0v-3a.5.5 0 00-.5-.5H9z" />
        </svg>
      )}
    </button>
  )
}
