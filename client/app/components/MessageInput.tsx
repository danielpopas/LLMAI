// client/app/components/MessageInput.tsx
'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface MessageInputProps {
	onSendMessage: (message: string) => void
	disabled?: boolean
	placeholder?: string
}

export default function MessageInput({
	onSendMessage,
	disabled = false,
	placeholder = 'Напишите ваше сообщение...',
}: MessageInputProps) {
	const [message, setMessage] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSubmit = () => {
		if (message.trim() && !disabled) {
			onSendMessage(message)
			setMessage('')
			// Сброс высоты textarea
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto'
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)

		// Автоматическое изменение высоты textarea
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${Math.min(
				textareaRef.current.scrollHeight,
				120
			)}px`
		}
	}

	return (
		<div className='input-container'>
			<textarea
				ref={textareaRef}
				value={message}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled}
				rows={1}
				className='message-input'
			/>

			{/* Дополнительные кнопки */}
			<div className='flex items-center gap-2'>
				{/* Кнопка прикрепления файла */}
				<button
					disabled
					className='p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50'
					title='Прикрепить файл (скоро)'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
						/>
					</svg>
				</button>

				{/* Кнопка микрофона */}
				<button
					disabled
					className='p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50'
					title='Голосовой ввод (скоро)'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
						/>
					</svg>
				</button>

				{/* Кнопка отправки */}
				<button
					onClick={handleSubmit}
					disabled={disabled || !message.trim()}
					className='send-button'
				>
					{disabled ? (
						<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
					) : (
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	)
}
