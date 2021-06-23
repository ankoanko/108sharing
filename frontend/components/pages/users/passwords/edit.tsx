import React from 'react'
import I18n from '../../../../core/i18n'
import { userService } from '../../../../core/services'
import { Button, InputText } from '../../../atoms'
import { Form } from '../../../molecules'
import UserLoginLayout from 'components/layouts/UserLoginLayout'
import { IconLock } from 'icon'

interface IProps {
  reset_password_token: string
}

const FIELDS = {
  reset_password_token: 'reset_password_token',
  password: 'password',
  password_confirmation: 'password_confirmation',
}

const UserPasswordsEdit: React.FC<IProps> = props => {
  const [errors, setErrors] = React.useState<any>({})
  const handleUpdateForm = React.useCallback(
    newErrors => {
      setErrors({ ...errors, ...newErrors })
    },
    [errors]
  )

  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const { redirectUrl } = await userService.resetPassword({ user: values })
    location.href = redirectUrl
  }, [])

  return (
    <UserLoginLayout>
      <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
        <div className="mt-4 first:mt-0">
          <input type="hidden" name="reset_password_token" value={props.reset_password_token} />
        </div>
        <div className="mt-4 first:mt-0">
          <InputText
            required={true}
            type="password"
            name="password"
            defaultValue=""
            label={I18n.t('password.new_password')}
            placeholder={I18n.t('password.new_password')}
            error={errors.password}
            icon={<IconLock />}
          />
        </div>
        <div className="mt-4 first:mt-0">
          <InputText
            required={true}
            type="password"
            name="password_confirmation"
            defaultValue=""
            label={I18n.t('password.new_password_confirmation')}
            placeholder={I18n.t('password.new_password_confirmation')}
            error={errors.password}
            icon={<IconLock />}
          />
        </div>
        <div className="flex flex-col items-center mt-6">
          {errors.login && <div className="my-4 text-sm text-red">{errors.login}</div>}
          <Button>{I18n.t('generic.send')}</Button>
        </div>
      </Form>
    </UserLoginLayout>
  )
}

export default UserPasswordsEdit
