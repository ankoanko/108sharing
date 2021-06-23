import * as React from 'react'
import get from 'lodash-es/get'
import cookie from 'cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'
import classNames from 'classnames'

interface IWindow {
  localePath: { [key: string]: string }
  location: any
}
declare let window: IWindow

interface IProps {
  className?: string
}

const LocaleSelector: React.FC<IProps> = props => {
  const parsedCookie = cookie.parse(document.cookie)
  const browserLanguage =
    (get(window, 'navigator.languages') && get(window, 'navigator.languages[0]')) ||
    get(window, 'navigator.language') ||
    get(window, 'navigator.userLanguage') ||
    get(window, 'navigator.browserLanguage')

  const changeLocale = locale => {
    if (window.localePath) {
      window.location.href = window.localePath[locale]
    }
  }

  return (
    <div className={classNames(['relative', props.className])}>
      <span className="absolute inset-y-0 left-0 flex items-center pointer-events-none ml-2">
        <FontAwesomeIcon
          className="absolute left-0 text-lg text-neutral-600"
          icon={faGlobeAmericas}
        />
      </span>
      <select
        className={classNames([
          'py-2 px-8 text-sm font-bold border border-neutral-300 rounded-md cursor-pointer',
          'outline-none appearance-none',
        ])}
        defaultValue={`${parsedCookie.locale || browserLanguage}_path`}
        onChange={event => {
          changeLocale(event.target.value)
        }}
      >
        <option value="ja_path">日本語</option>
        <option value="en_path">English</option>
      </select>
      <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none mr-2">
        <FontAwesomeIcon className="text-sm" icon={faChevronDown} />
      </span>
    </div>
  )
}

export default LocaleSelector
