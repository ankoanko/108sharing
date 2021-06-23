import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { InputText } from '../../../atoms'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

interface IProps {
  tag: IJsonResponse
}

const FIELDS = {
  id: 'id',
  name: 'name',
  position: 'position',
}

const title = I18n.t('admin.edit', {
  model: I18n.t('tag', { scope: 'activerecord.models' }),
})

const AdminTagEdit: React.FC<IProps> = props => {
  const { data } = adminService.getDataFromJson(props.tag)
  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const { updatedTag, flush } = await adminService.updateTag(values)
    // TODO 遷移先でのFlush
    location.href = '/admin/tags'
  }, [])

  return (
    <AdminLayout model="tag" title={title}>
      <AdminForm fields={FIELDS} indexLink="/admin/tags" handleSubmit={handleSubmit} type="edit">
        <>
          <AdminFormItem>
            <InputText readonly={true} name="id" defaultValue={data.id} label="ID" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText required={true} name="name" defaultValue={data.name} label="Name" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="position"
              defaultValue={data.position}
              label="Position"
            />
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminTagEdit
