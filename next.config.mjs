/** @type {import('next').NextConfig} */
const nextConfig = {   
    reactStrictMode: false, 
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'alicedevapi.casamelhor.in',
                pathname: '**',
            },
        ],
    }
};

export default nextConfig;
