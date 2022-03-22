/** @type {import('next').NextConfig} */

module.exports = {
    // reactStrictMode: true,
    // swcMinify: false,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        config.experiments = {
            asyncWebAssembly: true,
        }
        return config;
    },
    // async redirects() {
    //     return [{
    //         source: '/',
    //         destination: '/vault',
    //         permanent: false
    //     }]
    // }
};