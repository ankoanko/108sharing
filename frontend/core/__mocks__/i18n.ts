import * as fs from 'fs'
import * as yaml from 'js-yaml'
import get from 'lodash-es/get'
import merge from 'lodash-es/merge'
import * as path from 'path'

const TEST_LOCALE = 'en'
const baseText = fs.readFileSync(
  path.resolve(__dirname, '../../../config/locales/base-en.yml'),
  'utf8'
)
const activerecordText = fs.readFileSync(
  path.resolve(__dirname, '../../../config/locales/activerecord-en.yml'),
  'utf8'
)
const I18n: any = jest.genMockFromModule('i18n-js')

let translations
try {
  const base = yaml.safeLoad(baseText)
  const activerecord = yaml.safeLoad(activerecordText)

  translations = merge(base, activerecord)
} catch (e) {
  // console.log(e)
}

function mockTranslate(localePath, options: any = {}) {
  const _localePath = options.scope
    ? `${TEST_LOCALE}.${options.scope}.${localePath}`
    : `${TEST_LOCALE}.${localePath}`
  return get(translations, `${_localePath}`, `Missing Translation '${_localePath}'`)
}

I18n.t = mockTranslate

export default I18n
