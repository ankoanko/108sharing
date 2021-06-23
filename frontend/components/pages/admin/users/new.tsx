import * as React from 'react'
import I18n from '../../../../core/i18n'
import { adminService } from '../../../../core/services'
import { CheckBox, InputText } from '../../../atoms'
import { ROLES } from 'constants/roles'
import FormItem from 'components/layouts/FormItem'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

const FIELDS = {
  username: 'username',
  bio: 'bio',
  email: 'email',
  password: 'password',
  email_notification: 'email_notification',
  role_ids: 'role_ids',
}

const title = I18n.t('admin.create_new', {
  model: I18n.t('user', { scope: 'activerecord.models' }),
})

interface IProps {}

const AdminUserNew: React.FC<IProps> = () => {
  const handleSubmit = React.useCallback(async (initialValues, values) => {
    await adminService.createUser(values)
    // TODO 遷移先でのFlush
    location.href = '/admin/users'
  }, [])

  return (
    <AdminLayout model="user" title={title}>
      <AdminForm fields={FIELDS} indexLink="/admin/users" handleSubmit={handleSubmit} type="new">
        <>
          <AdminFormItem>
            <InputText
              required={true}
              name="username"
              defaultValue={''}
              label={I18n.t('generic.username')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="password"
              defaultValue={''}
              label={I18n.t('generic.password')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText required={true} name="bio" defaultValue={''} label={I18n.t('generic.bio')} />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="email"
              defaultValue={''}
              label={I18n.t('generic.email')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <FormItem label={I18n.t(`generic.role`)} required={true} error={null}>
              <>
                {Object.values(ROLES).map((role, i) => (
                  <CheckBox
                    key={i}
                    name="role_ids"
                    defaultChecked={false}
                    label={I18n.t(`role.${role.name}`)}
                    value={role.id}
                  />
                ))}
              </>
            </FormItem>
          </AdminFormItem>
          <AdminFormItem>
            <CheckBox
              name="email_notification"
              defaultChecked={true}
              label={I18n.t('settings.email_notification')}
            />
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminUserNew
