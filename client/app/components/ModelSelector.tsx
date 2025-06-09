// client/app/components/ModelSelector.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { ClaudeModel } from './ChatInterfaceFixed'

interface ModelSelectorProps {
	selectedModel: ClaudeModel
	onModelChange: (model: ClaudeModel) => void
	disabled?: boolean
}

const modelInfo = {
	'claude-opus-4': {
		name: 'Claude Opus 4',
		description: 'Most intelligent model for complex tasks',
		icon: '🧠',
	},
	'claude-sonnet-4': {
		name: 'Claude Sonnet 4',
		description: 'Optimal balance of intelligence, cost, and speed',
		icon: '⚡',
	},
}

export default function ModelSelector({
	selectedModel,
	onModelChange,
	disabled = false,
}: ModelSelectorProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Закрытие dropdown при клике вне его
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const selectedModelInfo = modelInfo[selectedModel]

	return (
		<div className='model-selector-dropdown' ref={dropdownRef}>
			<button
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className='model-selector-button'
			>
				<span className='model-icon'>{selectedModelInfo.icon}</span>
				<div className='model-info'>
					<div className='model-name'>{selectedModelInfo.name}</div>
				</div>
				<svg
					className={`w-4 h-4 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>

			{isOpen && (
				<div className='model-dropdown'>
					{(Object.keys(modelInfo) as ClaudeModel[]).map(model => {
						const info = modelInfo[model]
						const isSelected = selectedModel === model

						return (
							<button
								key={model}
								onClick={() => {
									onModelChange(model)
									setIsOpen(false)
								}}
								className={`model-option ${isSelected ? 'selected' : ''}`}
							>
								<span className='model-icon'>{info.icon}</span>
								<div className='model-info'>
									<div className='model-name'>{info.name}</div>
									<div className='model-description'>{info.description}</div>
								</div>
								{isSelected && (
									<svg
										className='w-4 h-4 text-blue-500'
										fill='currentColor'
										viewBox='0 0 20 20'
									>
										<path
											fillRule='evenodd'
											d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
											clipRule='evenodd'
										/>
									</svg>
								)}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
