// TODO i18n
import React from 'react'
import classNames from 'classnames'
import I18n from 'core/i18n'

interface IProps {
  expanded?: boolean
}

const Footer: React.FC<IProps> = props => {
  return (
    <footer
      className={classNames(['bg-neutral-700 py-8 md:py-10', !props.expanded && 'px-4 md:px-6'])}
    >
      <div className={classNames(['m-auto', props.expanded ? 'container' : 'max-w-screen-lg'])}>
        <div className="pb-6 md:flex md:justify-between">
          <div>
            <img
              className="w-40 m-auto md:m-0"
              src="/images/custom/logo-white.svg"
              alt="108Sharing"
            />
            <p className="mt-6 text-xs text-white text-opacity-75 md:w-64 tracking-normal">
              {I18n.t('footer.intro')}
            </p>
          </div>
          <div className="flex mt-8 md:mt-0">
            <ul className="w-1/2 md:w-40">
              <li className="mb-4 font-bold text-white text-opacity-100">
                {I18n.t('footer.nav.company')}
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="https://blog.108sharing.com/" target="_blank">
                  {I18n.t('footer.nav.blog')}
                </a>
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="https://bulbcorp.jp/" target="_blank">
                  {I18n.t('footer.nav.operating_company')}
                </a>
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="https://108sharing.com/contact.html">{I18n.t('footer.nav.contact')}</a>
              </li>
            </ul>
            <ul className="w-1/2 md:w-40">
              <li className="mb-4 font-bold text-white text-opacity-100">
                {I18n.t('footer.nav.support')}
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="">{I18n.t('footer.nav.privacy_policy')}</a>
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="">{I18n.t('footer.nav.term_of_use')}</a>
              </li>
              <li className="py-2 text-sm text-white text-opacity-75">
                <a href="">{I18n.t('footer.nav.faq')}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white border-opacity-25">
          <div
            className="
              flex flex-col-reverse items-center -m-3
              md:flex-row md:justify-between"
          >
            <div className="p-3">
              <span className="text-xs text-white text-opacity-75">©2021 BULB Corp.</span>
            </div>
            <div className="flex items-center p-3 -mx-2">
              <a className="px-2" href="#">
                <img
                  className="m-auto md:m-0 opacity-50"
                  src="/images/custom/facebook-icon.svg"
                  alt=""
                />
              </a>
              <a className="px-2" href="#">
                <img
                  className="m-auto md:m-0 opacity-50"
                  src="/images/custom/twitter-icon.svg"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
