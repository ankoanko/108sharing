import React from 'react'
import I18n from '../../../../core/i18n'
import { userService } from '../../../../core/services'
import { Button, InputText } from '../../../atoms'
import { Form } from '../../../molecules'
import TextLink from 'components/atoms/TextLink'
import UserLoginLayout from 'components/layouts/UserLoginLayout'
import { IconMail } from 'icon'

interface IProps {}

const FIELDS = {
  email: 'email',
}

const UserPasswordNew: React.FC<IProps> = props => {
  const [errors, setErrors] = React.useState<any>({})

  const handleUpdateForm = React.useCallback(
    newErrors => {
      setErrors({ ...errors, ...newErrors })
    },
    [errors]
  )

  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const { redirectUrl } = await userService.createPasswordResetInstruction({ user: values })
    location.href = redirectUrl
  }, [])

  return (
    <UserLoginLayout>
      <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
        <div>
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
        <div className="flex flex-col items-center mt-6">
          {errors.login && <div className="my-4 text-sm text-red">{errors.login}</div>}
          <Button type="submit">{I18n.t('generic.send')}</Button>
          <div className="mt-4">
            <TextLink href="/users/sign_up">{I18n.t('generic.create_new_account')}</TextLink>
          </div>
        </div>
      </Form>
    </UserLoginLayout>
  )
}

export default UserPasswordNew
