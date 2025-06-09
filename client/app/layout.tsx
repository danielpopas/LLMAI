// client/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'AI Chat Assistant - Advanced AI Models',
	description:
		'Полнофункциональная система общения с передовыми AI-моделями Claude Opus 4 и Sonnet 4. Бесплатный доступ к современным технологиям искусственного интеллекта.',
	keywords:
		'AI, Claude, Opus 4, Sonnet 4, чат, искусственный интеллект, ассистент',
	authors: [{ name: 'AI Chat Assistant' }],
	robots: 'index, follow',
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' className='scroll-smooth'>
			<head>
				<meta charSet='utf-8' />
				<link rel='icon' href='/favicon.ico' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
			>
				{children}
			</body>
		</html>
	)
}
