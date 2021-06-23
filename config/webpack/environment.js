// eslint-disable-next-line @typescript-eslint/no-var-requires
const { environment } = require('@rails/webpacker')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescript = require('./loaders/typescript')

environment.loaders.prepend('typescript', typescript)
module.exports = environment
