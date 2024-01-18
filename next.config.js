/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        largePageDataBytes: 128 * 1000000
    },
    typescript: {
        ignoreBuildErrors: true
    }
}

module.exports = nextConfig
