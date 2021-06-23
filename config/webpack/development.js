process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const environment = require('./environment')

environment.plugins.append(
  'MomentLocalesPlugin',
  MomentLocalesPlugin({ localesToKeep: ['en', 'ja'] })
)

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// environment.plugins.append(
//   'BundleAnalyzer',
//   new BundleAnalyzerPlugin({
//     openAnalyzer: true,
//     analyzerMode: 'server', // 'server', 'static', 'disabled'
//   })
// )

module.exports = environment.toWebpackConfig()
