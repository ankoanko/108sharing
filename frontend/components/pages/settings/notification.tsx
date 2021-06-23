import * as React from 'react'
import I18n from '../../../core/i18n'
import { IWindow } from '../../../core/interfaces'
import { settingsService, userService } from '../../../core/services'
import { Panel, Toggle } from '../../atoms'
import SettingsLayout from 'components/layouts/SettingsLayout'
import IUser from 'core/interfaces/IUser'

declare let window: IWindow

interface IProps {
  user: any
}

const Notification: React.FC<IProps> = props => {
  const user: IUser = userService.getUserFromJson(props.user).user
  const [emailNotification, setEmailNotification] = React.useState(user.email_notification)

  const handleChangeCheck = async event => {
    const data = {
      settings: {
        [event.target.name]: event.target.checked,
      },
    }
    const { user, flush } = await settingsService.updateNotification(data)
    setEmailNotification(userService.getUserFromJson(user)?.user?.email_notification)
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  return (
    <SettingsLayout
      user={user}
      main={
        <Panel title={I18n.t('settings.set_notification')}>
          <div className="flex items-center">
            <label className="w-50 text-sm">{I18n.t('settings.email_notification')}</label>
            <div className="flex-grow">
              <Toggle
                name="email_notification"
                checked={emailNotification}
                onChangeHandler={handleChangeCheck}
              />
            </div>
          </div>
        </Panel>
      }
    />
  )
}

export default Notification
