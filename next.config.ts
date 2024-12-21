import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack(config) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        return config;
    },
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    swcMinify: true,
}

export default nextConfig
