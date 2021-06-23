import * as I18n from 'i18n-js'

interface IWindow {
  I18n: any
}

declare let window: IWindow

const { defaultLocale, locale, translations } = window.I18n

I18n.defaultLocale = defaultLocale
I18n.locale = locale
I18n.translations = translations

export default I18n

// https://github.com/fnando/i18n-js/issues/514
// import I18n from '../../lang.js'
// {I18n.t('hello')}
