import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// client/next.config.ts
	experimental: {
		reactCompiler: false,
	},
	// Оптимизация для деплоя
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	// Настройки для Vercel
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
}

export default nextConfig
