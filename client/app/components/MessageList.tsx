// client/app/components/MessageList.tsx
'use client'

import { Message } from './ChatInterfaceFixed'
import TextToSpeech from './TextToSpeech'

interface MessageListProps {
	messages: Message[]
	isLoading: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
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
								{message.model === 'claude-opus-4'
									? '🧠 Claude Opus 4'
									: '⚡ Claude Sonnet 4'}
							</div>
						)}

						{/* Содержимое сообщения */}
						<div className='text-sm leading-relaxed'>
							{formatContent(message.content)}
						</div>

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
