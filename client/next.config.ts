import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Отключаем SSR для устранения проблем гидратации
	experimental: {
		reactCompiler: false,
	},
	// Принудительное клиентское рендеринг
	ssr: false,
	// Оптимизация для SPA
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
}

export default nextConfig
