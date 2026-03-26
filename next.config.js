const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use this app directory as tracing root when multiple lockfiles exist (e.g. parent folders).
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig
