import * as React from 'react'
import I18n from '../../../../core/i18n'
import { adminService } from '../../../../core/services'
import { CheckBox, InputText } from '../../../atoms'
import { ROLES } from 'constants/roles'
import FormItem from 'components/layouts/FormItem'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

const FIELDS = {
  id: 'id',
  username: 'username',
  bio: 'bio',
  email: 'email',
  email_notification: 'email_notification',
  role_ids: 'role_ids',
}

const title = I18n.t('admin.edit', {
  model: I18n.t('user', { scope: 'activerecord.models' }),
})

const AdminUserEdit: React.FC<{ user: any }> = props => {
  const { data } = adminService.getDataFromJson(props.user)
  const handleSubmit = React.useCallback(async (initialValues, values) => {
    await adminService.updateUser(values)
    // TODO 遷移先でのFlush
    location.href = '/admin/users'
  }, [])
  return (
    <AdminLayout model="user" title={title}>
      <AdminForm fields={FIELDS} indexLink="/admin/users" handleSubmit={handleSubmit} type="edit">
        <>
          <AdminFormItem>
            <InputText readonly={true} name="id" defaultValue={data.id} label="ID" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="username"
              defaultValue={data.username}
              label={I18n.t('generic.username')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="bio"
              defaultValue={data.bio}
              label={I18n.t('generic.bio')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="email"
              defaultValue={data.email}
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
                    defaultChecked={data.roles.some(userRole => userRole.id === role.id)}
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
              defaultChecked={data.email_notification}
              label={I18n.t('settings.email_notification')}
            />
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminUserEdit
