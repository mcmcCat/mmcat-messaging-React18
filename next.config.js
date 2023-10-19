/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    env: {},
    // env: {
    //   API_URL: 'https://api.example.com',
    //   API_KEY: 'your-api-key'
    // }
    // 用 process.env.API_URL 来获取
  },
};

module.exports = nextConfig;
