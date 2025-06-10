// client/app/components/MessageList.tsx
'use client'

import Image from 'next/image'
import { Message, ImageAttachment } from './ChatInterfaceFixed'
import TextToSpeech from './TextToSpeech'

interface MessageListProps {
	messages: Message[]
	isLoading: boolean
	onExtractText?: (image: ImageAttachment) => void
}

export default function MessageList({ messages, isLoading, onExtractText }: MessageListProps) {
	const formatTime = (timestamp: Date) => {
		return timestamp.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatContent = (content: string) => {
		// Простая обработка markdown-подобного форматирования
		return content.split('\n').map((line, index) => (
			<span key={index}>
				{line}
				{index < content.split('\n').length - 1 && <br />}
			</span>
		))
	}

	if (messages.length === 0 && !isLoading) {
		return (
			<div className='welcome-screen'>
				<div className='welcome-content'>
					<span className='welcome-icon'>🤖</span>
					<h3 className='welcome-title'>
						Привет! Как я могу помочь тебе сегодня?
					</h3>
					<p className='welcome-subtitle'>Выберите другую модель для ответа</p>
					<div className='welcome-hint'>✨ Доступ к GPT-4 и вебу</div>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{messages.map(message => (
				<div
					key={message.id}
					className={`message ${
						message.role === 'user' ? 'message-user' : 'message-assistant'
					}`}
				>
					<div
						className={`message-content ${
							message.role === 'user'
								? 'message-content-user'
								: 'message-content-assistant'
						}`}
					>
						{/* Заголовок сообщения */}
						{message.role === 'assistant' && (
							<div className='message-model'>
								{message.isTextExtraction ? (
									<span className='flex items-center gap-2'>
										📝 Анализ изображения •
										{message.model === 'claude-opus-4'
											? '🧠 Claude Opus 4'
											: '⚡ Claude Sonnet 4'}
									</span>
								) : (
									<span>
										{message.model === 'claude-opus-4'
											? '🧠 Claude Opus 4'
											: '⚡ Claude Sonnet 4'}
									</span>
								)}
							</div>
						)}

						{/* Изображение (если есть) */}
						{message.image && (
							<div className='mb-3'>
								<div className='relative inline-block'>
									<Image
										src={message.image.preview}
										alt="Прикрепленное изображение"
										width={384}
										height={256}
										className='max-w-sm max-h-64 object-contain rounded-lg border border-gray-600'
									/>
									{/* Кнопка извлечения текста */}
									{message.role === 'user' && onExtractText && (
										<button
											onClick={() => onExtractText(message.image!)}
											className='absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg z-20 border border-white/20'
											style={{
												background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
												boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
											}}
											title='Извлечь текст из изображения'
										>
											📝 Извлечь текст
										</button>
									)}
								</div>
								<div className='flex items-center justify-between mt-2'>
									<p className='text-xs text-gray-400'>
										{message.image.file.name || 'Изображение'}
									</p>
									{/* Дополнительная кнопка извлечения текста */}
									{message.role === 'user' && onExtractText && (
										<button
											onClick={() => onExtractText(message.image!)}
											className='px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors'
											title='Извлечь текст из изображения'
										>
											📝 Извлечь текст
										</button>
									)}
								</div>
							</div>
						)}

						{/* Содержимое сообщения */}
						{message.content && (
							<div className='text-sm leading-relaxed'>
								{formatContent(message.content)}
							</div>
						)}

						{/* Действия и время сообщения */}
						<div className='flex items-center justify-between mt-2'>
							<div className='message-timestamp'>
								{formatTime(message.timestamp)}
							</div>

							{/* Кнопки действий для сообщений ассистента */}
							{message.role === 'assistant' && (
								<div className='flex items-center gap-2'>
									<TextToSpeech text={message.content} />
									<button
										onClick={() =>
											navigator.clipboard.writeText(message.content)
										}
										className='p-2 text-gray-400 hover:text-white transition-colors'
										title='Копировать'
									>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
											/>
										</svg>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			))}

			{/* Индикатор загрузки */}
			{isLoading && (
				<div className='message message-assistant'>
					<div className='loading-indicator'>
						<div className='flex items-center gap-2 mb-2'>
							<span
								className='text-xs font-medium'
								style={{ color: 'var(--text-secondary)' }}
							>
								🤖 AI печатает...
							</span>
						</div>
						<div className='loading-dots'>
							<div className='loading-dot'></div>
							<div className='loading-dot'></div>
							<div className='loading-dot'></div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
