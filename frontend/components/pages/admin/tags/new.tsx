import * as React from 'react'
import I18n from '../../../../core/i18n'
import { adminService } from '../../../../core/services'
import { InputText } from '../../../atoms'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

const FIELDS = {
  name: 'name',
  position: 'position',
}

const title = I18n.t('admin.create_new', {
  model: I18n.t('tag', { scope: 'activerecord.models' }),
})

interface IProps {}

const AdminTagNew: React.FC<IProps> = props => {
  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const { createdTag, flush } = await adminService.createTag(values)
    // TODO 遷移先でのFlush
    location.href = '/admin/tags'
  }, [])

  return (
    <AdminLayout model="tag" title={title}>
      <AdminForm fields={FIELDS} indexLink="/admin/tags" handleSubmit={handleSubmit} type="new">
        <>
          <AdminFormItem>
            <InputText required={true} name="name" defaultValue="" label="Name" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText required={true} name="position" defaultValue="" label="Position" />
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminTagNew
