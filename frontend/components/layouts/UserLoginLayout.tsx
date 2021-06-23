import * as React from 'react'
import { Panel } from 'components/atoms'
import I18n from 'core/i18n'
import SocialLoginButtons from 'components/organisms/SocialLoginButtons'

interface IProps {
  title?: string | React.ReactElement
  showSocialLoginButtons?: boolean
  expanded?: boolean
}

const UserLoginLayout: React.FC<IProps> = props => {
  return (
    <div className="py-6 lg:py-10 px-4 max-w-2xl mx-auto">
      <Panel title={props.title} wrapperFull={true}>
        <div className={`mx-auto ${props.expanded ? '' : 'max-w-sm'}`}>{props.children}</div>

        {props.showSocialLoginButtons && (
          <>
            <div className="relative flex justify-center my-6">
              <span className="relative z-1 px-4 bg-white">{I18n.t('session.or')}</span>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full h-1px bg-neutral-300" />
              </div>
            </div>

            <div>
              <div className="text-center">{I18n.t('session.login_with_another_services')}</div>
              <div className="mt-6">
                <SocialLoginButtons />
              </div>
            </div>
          </>
        )}
      </Panel>
    </div>
  )
}

export default UserLoginLayout
