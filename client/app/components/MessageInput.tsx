// client/app/components/MessageInput.tsx
'use client'

import { useState, useRef, KeyboardEvent, DragEvent } from 'react'
import { ImageAttachment } from './ChatInterfaceFixed'

interface MessageInputProps {
	onSendMessage: (message: string, image?: ImageAttachment) => void
	disabled?: boolean
	placeholder?: string
}

export default function MessageInput({
	onSendMessage,
	disabled = false,
	placeholder = 'Напишите ваше сообщение...',
}: MessageInputProps) {
	const [message, setMessage] = useState('')
	const [attachedImage, setAttachedImage] = useState<ImageAttachment | null>(null)
	const [isDragOver, setIsDragOver] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = () => {
		if ((message.trim() || attachedImage) && !disabled) {
			onSendMessage(message, attachedImage || undefined)
			setMessage('')
			setAttachedImage(null)
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

	// Обработка загрузки файла
	const handleFileSelect = (file: File) => {
		if (!file.type.startsWith('image/')) {
			alert('Пожалуйста, выберите изображение')
			return
		}

		const reader = new FileReader()
		reader.onload = (e) => {
			const preview = e.target?.result as string
			setAttachedImage({
				file,
				preview,
			})
		}
		reader.readAsDataURL(file)
	}

	// Обработка drag & drop
	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
		setIsDragOver(true)
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)
	}

	const handleDrop = (e: DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)

		const files = Array.from(e.dataTransfer.files)
		const imageFile = files.find(file => file.type.startsWith('image/'))

		if (imageFile) {
			handleFileSelect(imageFile)
		}
	}

	// Обработка выбора файла через input
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleFileSelect(file)
		}
	}

	// Удаление прикрепленного изображения
	const removeAttachedImage = () => {
		setAttachedImage(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<div className='input-container'>
			{/* Скрытый input для выбора файлов */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInputChange}
				className="hidden"
			/>

			{/* Превью прикрепленного изображения */}
			{attachedImage && (
				<div className="mb-3 p-3 bg-gray-700 rounded-lg">
					<div className="flex items-start gap-3">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={attachedImage.preview}
							alt="Прикрепленное изображение"
							className="w-16 h-16 object-cover rounded-lg"
						/>
						<div className="flex-1">
							<p className="text-sm text-gray-300 mb-2">
								Изображение прикреплено: {attachedImage.file.name}
							</p>
							<div className="flex gap-2">
								<button
									onClick={removeAttachedImage}
									className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
								>
									Удалить
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Область для drag & drop */}
			<div
				className={`relative ${isDragOver ? 'bg-blue-500/10 border-blue-500' : ''}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{isDragOver && (
					<div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
						<p className="text-blue-400 font-medium">Отпустите изображение здесь</p>
					</div>
				)}

				<textarea
					ref={textareaRef}
					value={message}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={attachedImage ? 'Добавьте описание к изображению (необязательно)...' : placeholder}
					disabled={disabled}
					rows={1}
					className='message-input'
				/>
			</div>

			{/* Дополнительные кнопки */}
			<div className='flex items-center gap-2'>
				{/* Кнопка прикрепления изображения */}
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled}
					className='p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50'
					title='Прикрепить изображение'
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
							d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
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
					disabled={disabled || (!message.trim() && !attachedImage)}
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
