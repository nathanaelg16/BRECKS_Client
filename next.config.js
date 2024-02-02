/** @type {{images: {remotePatterns: string[]}}} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.brecks.app',
                pathname: '/logos/**'
            },
            {
                protocol: 'https',
                hostname: 'brecks.nyc3.cdn.digitaloceanspaces.com',
                pathname: '/images/**'
            }
        ]
    }
}

module.exports = nextConfig
