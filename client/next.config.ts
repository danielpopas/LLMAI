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
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
