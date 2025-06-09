// client/app/components/ChatInterfaceFixed.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import ModelSelector from './ModelSelector'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ToolsPanel from './ToolsPanel'
import FutureModels from './FutureModels'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface ImageAttachment {
	file: File
	preview: string
	extractedText?: string
}

export interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	model?: string
	image?: ImageAttachment
	isTextExtraction?: boolean
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
	type StoredMessage = Omit<Message, 'timestamp' | 'image'> & {
		timestamp: string
		image?: Omit<ImageAttachment, 'file'> & {
			fileName: string;
			fileSize: number;
			fileData?: string; // base64 данные файла
		}
	}

	// Безопасная работа с localStorage через кастомный хук
	const [storedMessages, setStoredMessages, clearStoredMessages, isHydrated] =
		useLocalStorage<StoredMessage[]>('ai-chat-history', [])

	// Функция для восстановления файла из base64
	const restoreFileFromBase64 = (base64Data: string, fileName: string): File => {
		try {
			const byteCharacters = atob(base64Data.split(',')[1])
			const byteNumbers = new Array(byteCharacters.length)
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i)
			}
			const byteArray = new Uint8Array(byteNumbers)
			return new File([byteArray], fileName, { type: 'image/jpeg' })
		} catch (error) {
			console.error('Error restoring file from base64:', error)
			return new File([], fileName, { type: 'image/jpeg' })
		}
	}

	// Конвертация сохраненных сообщений в правильный формат
	const messages = storedMessages.map(msg => ({
		...msg,
		timestamp: new Date(msg.timestamp),
		// Восстанавливаем изображение с реальным файлом если есть данные
		image: msg.image ? {
			file: msg.image.fileData
				? restoreFileFromBase64(msg.image.fileData, msg.image.fileName || 'image.jpg')
				: new File([], msg.image.fileName || 'image.jpg', { type: 'image/jpeg' }),
			preview: msg.image.preview,
			extractedText: msg.image.extractedText,
		} : undefined,
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

	// Функция для конвертации файла в base64
	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = error => reject(error)
		})
	}

	// Функция-помощник для сохранения сообщений
	const saveMessages = async (messagesToSave: Message[]) => {
		const messagesToStore = await Promise.all(messagesToSave.map(async msg => {
			let imageData = undefined

			if (msg.image && msg.image.file.size > 0) {
				try {
					const base64Data = await fileToBase64(msg.image.file)
					imageData = {
						preview: msg.image.preview,
						fileName: msg.image.file.name,
						fileSize: msg.image.file.size,
						extractedText: msg.image.extractedText,
						fileData: base64Data,
					}
				} catch (error) {
					console.error('Error converting file to base64:', error)
					imageData = {
						preview: msg.image.preview,
						fileName: msg.image.file.name,
						fileSize: msg.image.file.size,
						extractedText: msg.image.extractedText,
					}
				}
			}

			return {
				...msg,
				timestamp: msg.timestamp.toISOString(),
				image: imageData,
			}
		}))

		setStoredMessages(messagesToStore)
	}

	// Отправка сообщения
	const sendMessage = async (content: string, image?: ImageAttachment) => {
		if (!isPuterLoaded || !window.puter || (!content.trim() && !image)) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: content.trim() || (image ? 'Изображение загружено' : ''),
			timestamp: new Date(),
			image: image,
		}

		const newMessages = [...messages, userMessage]

		// Сохраняем сообщения
		await saveMessages(newMessages)
		setIsLoading(true)

		try {
			// Проверяем доступность Puter.js
			if (!window.puter || !window.puter.ai) {
				throw new Error('Puter.js не загружен')
			}

			console.log('Puter.js status:', {
				puter: !!window.puter,
				ai: !!window.puter.ai,
				chat: !!window.puter.ai.chat,
				img2txt: !!window.puter.ai.img2txt
			})

			console.log('Sending message with image:', !!image, 'content:', content)

			let response: any

			// Если есть изображение, используем chat API с изображением
			if (image && image.preview) {
				console.log('Using chat API with image, preview URL:', image.preview)

				// Проверяем, что preview это data URL
				if (!image.preview.startsWith('data:')) {
					throw new Error('Изображение должно быть в формате data URL')
				}

				try {
					// Извлекаем MIME тип и base64 данные из data URL
					const mimeMatch = image.preview.match(/^data:([^;]+);base64,(.+)$/)
					if (!mimeMatch) {
						throw new Error('Неверный формат data URL изображения')
					}

					const mimeType = mimeMatch[1]
					const base64Data = mimeMatch[2]

					// Используем messages array формат для Claude API
					const messages = [
						{
							role: 'user',
							content: [
								{
									type: 'text',
									text: content || 'Опиши это изображение подробно'
								},
								{
									type: 'image',
									source: {
										type: 'base64',
										media_type: mimeType,
										data: base64Data
									}
								}
							]
						}
					]

					console.log('Sending messages to Claude:', {
						messageCount: messages.length,
						contentItems: messages[0].content.length,
						mimeType,
						dataLength: base64Data.length
					})

					response = await window.puter.ai.chat(messages, false, {
						model: selectedModel,
						stream: false,
					})

					console.log('Chat API response:', response)
				} catch (apiError) {
					console.error('Chat API error:', apiError)
					console.error('API Error details:', JSON.stringify(apiError, null, 2))
					throw new Error(`Ошибка API: ${JSON.stringify(apiError)}`)
				}
			} else {
				console.log('Using regular chat API')
				// Обычный текстовый запрос
				response = await window.puter.ai.chat(content, {
					model: selectedModel,
					stream: false,
				})
			}

			// Обработка ответа с правильной типизацией
			console.log('Processing response:', typeof response, response)

			let responseText: string
			if (typeof response === 'string') {
				responseText = response
			} else if (
				response &&
				typeof response === 'object' &&
				'message' in response
			) {
				// Ответ от chat API
				if (response.message?.content?.[0]?.text) {
					responseText = response.message.content[0].text
				} else if (response.message?.content) {
					responseText = String(response.message.content)
				} else {
					responseText = String(response.message || response)
				}
			} else if (
				response &&
				typeof response === 'object' &&
				'text' in response
			) {
				// Ответ от img2txt API
				responseText = response.text || 'Ошибка получения ответа'
			} else if (response && typeof response === 'object') {
				// Попытка извлечь любой текстовый контент
				responseText = JSON.stringify(response)
			} else {
				responseText = 'Неожиданный формат ответа'
			}

			console.log('Final response text:', responseText)

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: responseText,
				timestamp: new Date(),
				model: selectedModel,
				isTextExtraction: image ? true : false,
			}

			const finalMessages = [...newMessages, assistantMessage]

			// Сохраняем финальные сообщения
			await saveMessages(finalMessages)
		} catch (error) {
			console.error('Ошибка отправки сообщения:', error)

			let errorText = 'Извините, произошла ошибка при обработке вашего запроса.'

			if (error instanceof Error) {
				errorText += ` Детали: ${error.message}`
				console.error('Error details:', error.stack)
			} else if (typeof error === 'string') {
				errorText += ` Детали: ${error}`
			} else {
				console.error('Unknown error type:', error)
			}

			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: errorText,
				timestamp: new Date(),
				model: selectedModel,
			}

			const errorMessages = [...newMessages, errorMessage]
			await saveMessages(errorMessages)
		} finally {
			setIsLoading(false)
		}
	}

	// Извлечение текста из изображения
	const extractTextFromImage = async (image: ImageAttachment) => {
		if (!isPuterLoaded || !window.puter || !window.puter.ai) {
			console.error('Puter.js not loaded or AI not available')
			return
		}

		setIsLoading(true)

		try {
			console.log('Starting text extraction from image:', {
				hasFile: !!image.file,
				fileSize: image.file?.size,
				fileName: image.file?.name,
				hasPreview: !!image.preview
			})

			// Проверяем, что у нас есть реальный файл
			if (!image.file || image.file.size === 0) {
				throw new Error('Файл изображения недоступен. Попробуйте загрузить изображение заново.')
			}

			let extractedText: string

			// img2txt API ожидает URL изображения, а не File объект
			// Используем preview (data URL) для всех случаев
			console.log('Using img2txt API with preview URL...')

			if (!image.preview || !image.preview.startsWith('data:')) {
				throw new Error('Изображение должно быть в формате data URL')
			}

			const response = await window.puter.ai.img2txt(image.preview, false)

			console.log('img2txt API response:', response, 'type:', typeof response)

			// img2txt возвращает строку с извлеченным текстом
			extractedText = typeof response === 'string' ? response : 'Не удалось извлечь текст из изображения'

			console.log('Final extracted text:', extractedText)

			// Создаем сообщение с извлеченным текстом
			const extractionMessage: Message = {
				id: Date.now().toString(),
				role: 'assistant',
				content: `📝 **Извлеченный текст из изображения:**\n\n${extractedText}`,
				timestamp: new Date(),
				model: selectedModel,
				isTextExtraction: true,
			}

			const newMessages = [...messages, extractionMessage]
			await saveMessages(newMessages)

		} catch (error) {
			console.error('Ошибка извлечения текста:', error)
			console.error('Error type:', typeof error)
			console.error('Error details:', {
				message: error?.message,
				stack: error?.stack,
				name: error?.name
			})

			let errorText = 'Извините, произошла ошибка при извлечении текста из изображения.'

			if (error instanceof Error) {
				errorText += ` Детали: ${error.message}`
			} else if (typeof error === 'string') {
				errorText += ` Детали: ${error}`
			} else if (error && typeof error === 'object') {
				errorText += ` Детали: ${JSON.stringify(error)}`
			}

			const errorMessage: Message = {
				id: Date.now().toString(),
				role: 'assistant',
				content: errorText,
				timestamp: new Date(),
				model: selectedModel,
			}

			const errorMessages = [...messages, errorMessage]
			await saveMessages(errorMessages)
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
					<MessageList
						messages={messages}
						isLoading={isLoading}
						onExtractText={extractTextFromImage}
					/>
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
