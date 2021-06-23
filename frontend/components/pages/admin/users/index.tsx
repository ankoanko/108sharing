import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IPager, IWindow } from '../../../../core/interfaces'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'

declare let window: IWindow

interface IProps {
  users: {
    users: IJsonResponse
    meta: IPager
  }
}

const COLUMNS = [
  {
    name: I18n.t('generic.id'),
    field: 'id',
    required: false,
    readOnly: true,
  },
  {
    name: I18n.t('generic.username'),
    field: 'username',
    required: false,
  },
  {
    name: I18n.t('generic.email'),
    field: 'email',
    required: true,
  },
  {
    name: I18n.t('generic.role'),
    field: user => user.roles.map(role => I18n.t(`role.${role.name}`)).join(', '),
    required: true,
  },
]

const AdminUserIndex: React.FC<IProps> = props => {
  const { data } = adminService.getDataFromJson(props.users.users)
  const [users, setUsers] = React.useState(data)
  const handleDelete = React.useCallback(
    async id => {
      const { flush } = await adminService.deleteUser(id)
      window.flashMessages.addMessage({
        text: flush.message,
        type: flush.type,
      })
      setUsers(users.filter(user => user.id !== id))
    },
    [users]
  )

  return (
    <AdminLayout
      model="user"
      title={I18n.t('activerecord.models.user')}
      link="/admin/users/new"
      linkText={I18n.t('generic.create_new')}
    >
      <EditTable
        editable={true}
        columns={COLUMNS}
        records={users}
        pagination={props.users.users.meta}
        handleDelete={handleDelete}
        getEditLink={id => `/admin/users/${id}/edit`}
      />
    </AdminLayout>
  )
}

export default AdminUserIndex
