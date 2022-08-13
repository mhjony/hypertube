/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['https://img.yts.mx/', 'https://m.media-amazon.com'],
    loader: 'default',
    optimizeImages: true,
    optimizeImagesInDev: true,
    optimizeImagesInProduction: true
  }
}
