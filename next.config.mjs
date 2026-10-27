/** @type {import('next').NextConfig} */
const nextConfig = {
  // السماح بالـ IP الخاص ببيئة التطوير (WSL/Virtual Network)
  allowedDevOrigins: ['172.19.192.1:3000', 'localhost:3000', '127.0.0.1:3000'],
};

export default nextConfig;