// client/app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import ErrorBoundary from './components/ErrorBoundary'

// Динамический импорт без SSR для избежания проблем с гидратацией
const ChatInterfaceFixed = dynamic(
	() => import('./components/ChatInterfaceFixed'),
	{
		ssr: false,
		loading: () => (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div
						className='animate-spin rounded-full h-12 w-12 border-b-2 animate-pulse-glow mx-auto mb-4'
						style={{ borderColor: 'var(--accent-primary)' }}
					></div>
					<p style={{ color: 'var(--text-secondary)' }}>
						Загрузка AI Chat Assistant...
					</p>
					<p className='text-sm mt-2' style={{ color: 'var(--text-muted)' }}>
						Инициализация системы искусственного интеллекта
					</p>
				</div>
			</div>
		),
	}
)

export default function Home() {
	return (
		<div className='min-h-screen' style={{ background: 'var(--bg-primary)' }}>
			<ErrorBoundary>
				<ChatInterfaceFixed />
			</ErrorBoundary>
		</div>
	)
}
