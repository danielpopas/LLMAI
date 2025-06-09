// client/app/components/ChatInterfaceFixed.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import ModelSelector from './ModelSelector'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ToolsPanel from './ToolsPanel'
import FutureModels from './FutureModels'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	model?: string
}

export type ClaudeModel = 'claude-opus-4' | 'claude-sonnet-4'

export default function ChatInterfaceFixed() {
	const [selectedModel, setSelectedModel] =
		useState<ClaudeModel>('claude-sonnet-4')
	const [isLoading, setIsLoading] = useState(false)
	const [isPuterLoaded, setIsPuterLoaded] = useState(false)
	const [showFutureModels, setShowFutureModels] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Типизация для сохраненных сообщений
	type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string }

	// Безопасная работа с localStorage через кастомный хук
	const [storedMessages, setStoredMessages, clearStoredMessages, isHydrated] =
		useLocalStorage<StoredMessage[]>('ai-chat-history', [])

	// Конвертация сохраненных сообщений в правильный формат
	const messages = storedMessages.map(msg => ({
		...msg,
		timestamp: new Date(msg.timestamp),
	}))

	// Загрузка Puter.js SDK без принудительной авторизации
	useEffect(() => {
		if (!isHydrated) return

		const script = document.createElement('script')
		script.src = 'https://js.puter.com/v2/'
		script.async = true
		script.onload = () => {
			// Просто отмечаем, что Puter загружен
			// Авторизация произойдет автоматически при первом AI запросе
			setIsPuterLoaded(true)
		}
		script.onerror = () => {
			console.error('Ошибка загрузки Puter.js')
			setIsPuterLoaded(true) // Показываем интерфейс даже при ошибке
		}
		document.head.appendChild(script)

		return () => {
			if (document.head.contains(script)) {
				document.head.removeChild(script)
			}
		}
	}, [isHydrated])

	// Автопрокрутка к последнему сообщению
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	// Отправка сообщения
	const sendMessage = async (content: string) => {
		if (!isPuterLoaded || !window.puter || !content.trim()) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: content.trim(),
			timestamp: new Date(),
		}

		const newMessages = [...messages, userMessage]

		// Сохраняем сообщения с правильным форматом timestamp
		const messagesToStore = newMessages.map(msg => ({
			...msg,
			timestamp: msg.timestamp.toISOString(),
		}))
		setStoredMessages(messagesToStore)
		setIsLoading(true)

		try {
			// Проверяем доступность Puter.js
			if (!window.puter || !window.puter.ai) {
				throw new Error('Puter.js не загружен')
			}

			// Отправка запроса к Claude через Puter.js
			// Авторизация произойдет автоматически при необходимости
			const response = await window.puter.ai.chat(content, {
				model: selectedModel,
				stream: false,
			})

			// Обработка ответа с правильной типизацией
			let responseText: string
			if (typeof response === 'string') {
				responseText = response
			} else if (
				response &&
				typeof response === 'object' &&
				'message' in response
			) {
				responseText =
					response.message?.content?.[0]?.text || 'Ошибка получения ответа'
			} else {
				responseText = 'Неожиданный формат ответа'
			}

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: responseText,
				timestamp: new Date(),
				model: selectedModel,
			}

			const finalMessages = [...newMessages, assistantMessage]

			// Сохраняем финальные сообщения
			const finalMessagesToStore = finalMessages.map(msg => ({
				...msg,
				timestamp: msg.timestamp.toISOString(),
			}))
			setStoredMessages(finalMessagesToStore)
		} catch (error) {
			console.error('Ошибка отправки сообщения:', error)
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content:
					'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
				timestamp: new Date(),
				model: selectedModel,
			}

			const errorMessages = [...newMessages, errorMessage]
			const errorMessagesToStore = errorMessages.map(msg => ({
				...msg,
				timestamp: msg.timestamp.toISOString(),
			}))
			setStoredMessages(errorMessagesToStore)
		} finally {
			setIsLoading(false)
		}
	}

	// Очистка чата
	const clearChat = () => {
		clearStoredMessages()
	}

	if (!isHydrated || !isPuterLoaded) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div
						className='animate-spin rounded-full h-12 w-12 border-b-2 animate-pulse-glow mx-auto mb-4'
						style={{ borderColor: 'var(--accent-primary)' }}
					></div>
					<p style={{ color: 'var(--text-secondary)' }}>
						{!isHydrated ? 'Инициализация...' : 'Загрузка AI системы...'}
					</p>
					<p className='text-sm mt-2' style={{ color: 'var(--text-muted)' }}>
						Подготовка к работе с Claude AI
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='app-container'>
			{/* Боковая панель */}
			<div className='sidebar'>
				<div className='sidebar-header'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-sm'>AI</span>
						</div>
						<div>
							<h1 className='text-lg font-semibold text-white'>Monica</h1>
							<p className='text-xs text-gray-400'>AI Chat Assistant</p>
						</div>
					</div>
				</div>

				<div className='sidebar-content'>
					{/* Селектор модели */}
					<div className='mb-6'>
						<div className='text-sm font-medium text-gray-300 mb-3 flex items-center gap-2'>
							<span className='text-blue-400'>🤖</span>
							<span>Модель AI</span>
						</div>
						<ModelSelector
							selectedModel={selectedModel}
							onModelChange={setSelectedModel}
							disabled={isLoading}
						/>

						{/* Кнопка для показа будущих моделей */}
						<button
							onClick={() => setShowFutureModels(!showFutureModels)}
							className='w-full text-left p-3 rounded-lg text-gray-400 hover:text-gray-300 transition-all mt-2'
						>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<span className='text-lg'>🔮</span>
									<span className='text-sm'>Все модели</span>
								</div>
								<svg
									className={`w-4 h-4 transition-transform ${
										showFutureModels ? 'rotate-90' : ''
									}`}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</div>
						</button>

						{/* Будущие модели */}
						<FutureModels
							isExpanded={showFutureModels}
							onToggle={() => setShowFutureModels(!showFutureModels)}
						/>
					</div>

					{/* Инструменты */}
					<div className='mb-6'>
						<div className='text-sm font-medium text-gray-300 mb-3 flex items-center gap-2'>
							<span className='text-purple-400'>🛠️</span>
							<span>Инструменты</span>
						</div>
						<div className='space-y-1'>
							<button
								onClick={clearChat}
								disabled={isLoading || messages.length === 0}
								className='w-full text-left p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<div className='flex items-center gap-3'>
									<span className='text-lg'>🗑️</span>
									<span className='text-sm'>Очистить чат</span>
								</div>
							</button>
						</div>
					</div>

					{/* Информация */}
					<div className='mt-auto pt-4 border-t border-gray-700'>
						<div className='text-xs text-gray-500 text-center'>
							<div className='mb-1'>Powered by Puter.js</div>
							<div>Claude Opus 4 & Sonnet 4</div>
						</div>
					</div>
				</div>
			</div>

			{/* Основная область чата */}
			<div className='chat-main'>
				{/* Заголовок чата */}
				<div className='chat-header'>
					<div className='flex items-center gap-3'>
						<span className='text-2xl'>🤖</span>
						<div>
							<h2 className='text-lg font-semibold text-white'>Monica</h2>
							<p className='text-sm text-gray-400'>
								Привет! Как я могу помочь тебе сегодня?
							</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-400'>Доступ к GPT-4 и вебу</span>
						<div className='flex items-center gap-1'>
							{/* Иконки моделей */}
							<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
								<span className='text-xs text-white'>🧠</span>
							</div>
							<div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
								<span className='text-xs text-white'>⚡</span>
							</div>
						</div>
					</div>
				</div>

				{/* Область сообщений */}
				<div className='chat-messages'>
					<MessageList messages={messages} isLoading={isLoading} />
					<div ref={messagesEndRef} />
				</div>

				{/* Панель инструментов */}
				<ToolsPanel disabled={isLoading} />

				{/* Поле ввода */}
				<div className='chat-input-container'>
					<MessageInput
						onSendMessage={sendMessage}
						disabled={isLoading}
						placeholder='Спрашивайте меня что угодно...'
					/>
				</div>
			</div>
		</div>
	)
}
