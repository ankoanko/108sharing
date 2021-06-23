import * as React from 'react'
import I18n from 'core/i18n'
import { IUser } from 'core/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import classNames from 'classnames'
import Collapse from 'components/atoms/Collapse'
import { Desktop, MobileOrTablet } from 'utils/responsive'

interface IProps {
  user: IUser
}

const UserShowProfile: React.FC<IProps> = ({ user }) => (
  <div>
    <div className="flex lg:flex-col items-center">
      <div>
        <img
          className="w-16 h-16 lg:w-28 lg:h-28 object-cover rounded-full"
          src={user.avatar_url}
          alt={user.username}
        />
      </div>
      <div
        className={classNames(['flex-grow w-0 ml-4', 'lg:ml-0 lg:mt-4 lg:w-full lg:text-center'])}
      >
        <div className="font-bold">{user.username}</div>
        <div className="mt-1 lg:mt-2 text-sm lg:text-xs">
          {I18n.t('avatar.avatar_created_at', { created_at: user.created_at })}
        </div>
      </div>
    </div>
    <div className="mt-6 text-sm">
      <div className="flex mt-3 first:mt-0">
        <div>
          <FontAwesomeIcon className="text-sm text-yellow" icon={faStar} />
        </div>
        <div className="ml-2">{I18n.t('generic.review_count', { count: user.reviews_count })}</div>
      </div>
      {user.identification_workflow_state === 'approved' && (
        <div className="flex mt-3 first:mt-0">
          <div>
            <FontAwesomeIcon icon={faCheck} className={'text-sm text-green'} />
          </div>
          <div className="ml-2">
            {I18n.t(
              `enums.identification.workflow_state_message.${user.identification_workflow_state}`
            )}
          </div>
        </div>
      )}
    </div>
    <div className="mt-4">
      <MobileOrTablet>
        <Collapse>
          <div className="whitespace-pre-wrap max-h-36">{user.bio}</div>
        </Collapse>
      </MobileOrTablet>
      <Desktop>
        <div className="whitespace-pre-wrap max-h-36">{user.bio}</div>
      </Desktop>
    </div>
  </div>
)

export default UserShowProfile
