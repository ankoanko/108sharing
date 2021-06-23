import React from 'react'
import I18n from '../../../../core/i18n'
import { userService } from '../../../../core/services'
import { Button, InputText } from '../../../atoms'
import { Form } from '../../../molecules'
import TextLink from 'components/atoms/TextLink'
import UserLoginLayout from 'components/layouts/UserLoginLayout'
import { IconLock, IconMail } from 'icon'

const FIELDS = {
  email: 'email',
  password: 'password',
}

interface IProps {}

const UserSessionsNew: React.FC<IProps> = props => {
  const [errors, setErrors] = React.useState<{ login: string; email: string; password: string }>({
    login: '',
    email: '',
    password: '',
  })

  const handleUpdateForm = (error, hasNoError) => {
    setErrors({ ...error })
  }

  const handleSubmit = async (initialValues, values) => {
    try {
      const { redirectUrl } = await userService.signIn({ user: values })
      errors.login = null
      setErrors({ ...errors })
      location.href = redirectUrl
    } catch (error) {
      errors.login = I18n.t('session.invalid_mail_or_password')
      setErrors({ ...errors })
    }
  }
  return (
    <UserLoginLayout
      title={<div className="text-center">{I18n.t('generic.login')}</div>}
      showSocialLoginButtons={true}
    >
      <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
        <div className="mt-4 first:mt-0">
          <InputText
            required={true}
            name="email"
            defaultValue=""
            label=""
            placeholder={I18n.t('generic.email')}
            error={errors.email}
            icon={<IconMail />}
          />
        </div>
        <div className="mt-4 first:mt-0">
          <InputText
            required={true}
            type="password"
            name="password"
            defaultValue=""
            label=""
            placeholder={I18n.t('generic.password')}
            error={errors.password}
            icon={<IconLock />}
          />
        </div>
        <div className="flex flex-col items-center mt-6">
          {errors.login && <div className="my-4 text-sm text-red">{errors.login}</div>}
          <Button type="submit">{I18n.t('generic.login')}</Button>
          <div className="mt-4">
            <TextLink href="/users/password/new">{I18n.t('session.forgot_password')}</TextLink>
          </div>
          <div className="mt-2">
            <TextLink href="/users/sign_up">{I18n.t('generic.create_new_account')}</TextLink>
          </div>
          <div className="mt-2">
            <TextLink href="/users/confirmation/new">
              {I18n.t('devise.confirmations.new.resend_confirmation_instructions')}
            </TextLink>
          </div>
        </div>
      </Form>
    </UserLoginLayout>
  )
}

export default UserSessionsNew
