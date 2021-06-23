import * as React from 'react'
import { Panel } from 'components/atoms'
import I18n from 'core/i18n'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { IUser } from 'core/interfaces'

interface IProps {
  user: IUser
}

const ProfilePanelAuthenticationStatus: React.FC<IProps> = props => {
  const authenticationItems = [
    {
      name: I18n.t('generic.identification'),
      authenticated: props.user.identification_workflow_state === 'approved',
    },
  ]

  return (
    <Panel title={I18n.t('settings.authenticated_items')}>
      <ul>
        {authenticationItems.map((item, index) => (
          <li className="flex items-center justify-between lg:justify-start" key={index}>
            <div className="w-32">{item.name}</div>
            <div className="flex items-center">
              <div>
                {I18n.t(`settings.${item.authenticated ? 'authenticated' : 'unauthenticated'}`)}
              </div>
              <div className="ml-2">
                <FontAwesomeIcon
                  icon={item.authenticated ? faCheck : faBan}
                  className={item.authenticated ? 'text-green' : 'text-red'}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export default ProfilePanelAuthenticationStatus
