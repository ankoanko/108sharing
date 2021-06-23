import * as React from 'react'
import I18n from '../../../core/i18n'
import { IUser, IWindow } from '../../../core/interfaces'
import { settingsService, userService } from '../../../core/services'
import { InputText, Panel } from '../../atoms'
import { Form } from '../../molecules'
import Button from 'components/atoms/Button'

declare let window: IWindow

interface IProps {
  user: IUser
  setUser: (user: IUser) => void
}

const FIELDS_PASSWORD = {
  password: 'password',
  current_password: 'current_password',
}

const ProfilePanelAccountForm: React.FC<IProps> = props => {
  const email = props.user.email
  const socialProfiles = [...props.user.social_profiles].map(profile => profile.provider)
  const [isEmailSubmitEnabled, setIsEmailSubmitEnabled] = React.useState(false)
  const [isPasswordSubmitEnabled, setIsPasswordSubmitEnabled] = React.useState(false)
  const [emailErrors, setEmailErrors] = React.useState<{ [key: string]: string | null }>({
    email: null,
  })
  const [passwordErrors, setPasswordErrors] = React.useState<{ [key: string]: string | null }>({
    password: null,
  })

  const updateEmail = async values => {
    await userService.updateUser(values)
    window.flashMessages.addMessage({
      text: `"${values.email}" ${I18n.t('settings.confirm_email')}`,
      type: 'success',
    })
  }

  const updatePassword = async values => {
    const { flush } = await userService.updatePassword({ user: values })
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  const deleteSocialProfile = async provider => {
    const { user: userJson, flush } = await settingsService.deleteSocialProfile(provider)
    window.flashMessages.addMessage({
      text: flush.message,
      type: flush.type,
    })
    const { user } = userService.getUserFromJson(userJson)
    props.setUser(user)
  }

  return (
    <Panel title={I18n.t('generic.accounts')}>
      <section className="mt-8 first:mt-0">
        <Form
          fields={{ email: 'email' }}
          handleUpdateForm={(updatedErrors, isSubmitEnabled) => {
            setEmailErrors(updatedErrors)
            setIsEmailSubmitEnabled(isSubmitEnabled)
          }}
          handleSubmit={(initialValues, values) => updateEmail(values)}
        >
          <div className="mt-4 first:mt-0">
            <InputText
              required={true}
              name="email"
              label={I18n.t('settings.new_email')}
              error={emailErrors.email}
              defaultValue={''}
              placeholder={email}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <Button size="small" disabled={!isEmailSubmitEnabled}>
              {I18n.t('generic.update')}
            </Button>
          </div>
        </Form>
      </section>
      <section className="mt-8 first:mt-0">
        <Form
          fields={FIELDS_PASSWORD}
          handleUpdateForm={(updatedErrors, isSubmitEnabled) => {
            setPasswordErrors(updatedErrors)
            setIsPasswordSubmitEnabled(isSubmitEnabled)
          }}
          handleSubmit={(initialValues, values) => {
            updatePassword(values)
          }}
        >
          <div className="mt-4 first:mt-0">
            <InputText
              required={true}
              type="password"
              name="current_password"
              label={I18n.t('settings.current_password')}
              defaultValue=""
              error={passwordErrors.password}
            />
          </div>
          <div className="mt-4 first:mt-0">
            <InputText
              required={true}
              type="password"
              name="password"
              label={I18n.t('settings.new_password')}
              defaultValue=""
              error={passwordErrors.current_password}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <Button size="small" disabled={!isPasswordSubmitEnabled}>
              {I18n.t('generic.update')}
            </Button>
          </div>
        </Form>
      </section>

      {socialProfiles.length > 0 && (
        <section className="mt-8 first:mt-0">
          <div className="text-sm">{I18n.t('generic.connecting_accounts')}</div>
          <ul className="mt-4">
            {socialProfiles.map(provider => (
              <li key={provider} className="flex items-center mt-6 first:mt-0">
                <div className="flex-grow text-xs">{I18n.t(`provider.${provider}`)}</div>
                <div className="w-30">
                  <Button
                    type="button"
                    size="small"
                    handleClick={() => deleteSocialProfile(provider)}
                  >
                    {I18n.t('generic.unlink')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Panel>
  )
}

export default ProfilePanelAccountForm
