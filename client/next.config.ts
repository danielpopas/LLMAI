import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// client/next.config.ts
	experimental: {
		reactCompiler: false,
	},
	// Оптимизация для SPA
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	// Настройки для Vercel деплоя
	output: 'standalone',
}

export default nextConfig
