import React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { userService } from '../../../../core/services'
import { Button, InputText } from '../../../atoms'
import { Form } from '../../../molecules'
import { ROLES } from 'constants/roles'
import TextLink from 'components/atoms/TextLink'
import UserLoginLayout from 'components/layouts/UserLoginLayout'
import { IconLock, IconMail, IconPerson } from 'icon'

declare let window: IWindow

const FIELDS = {
  username: 'username',
  email: 'email',
  password: 'password',
}

interface IProps {}

const UserRegistrationsNew: React.FC<IProps> = props => {
  const [errors, setErrors] = React.useState<{ username: string; email: string; password: string }>(
    {
      username: '',
      email: '',
      password: '',
    }
  )
  const [email, setEmail] = React.useState<null | string>(null)

  const handleUpdateForm = (error, hasNoError) => {
    setErrors({ ...error })
  }

  const handleSubmit = async (initialValues, values) => {
    const { flush } = await userService.createUser({
      ...values,
      role_ids: [ROLES.Guest.id, ROLES.Host.id],
    })
    setEmail(values.email)
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  if (email) {
    return (
      <UserLoginLayout expanded={true}>
        <div className="text-center">
          <div className="font-bold">{email}</div>
          <div>{I18n.t('session.confirm_email')}</div>
        </div>
      </UserLoginLayout>
    )
  }

  return (
    <UserLoginLayout showSocialLoginButtons={true}>
      <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
        <div className="mt-4 first:mt-0">
          <InputText
            required={true}
            name="username"
            defaultValue=""
            label=""
            placeholder={I18n.t('generic.username')}
            error={errors.username}
            icon={<IconPerson />}
          />
        </div>
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
          <Button type="submit">{I18n.t('generic.create')}</Button>
          <div className="mt-4">
            <TextLink href="/users/sign_in">{I18n.t('session.have_account')}</TextLink>
          </div>
        </div>
      </Form>
    </UserLoginLayout>
  )
}

export default UserRegistrationsNew
