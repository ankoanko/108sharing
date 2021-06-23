import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { InputText } from '../../../atoms'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

interface IProps {
  category: IJsonResponse
}

const FIELDS = {
  id: 'id',
  name: 'name',
  position: 'position',
}

const title = I18n.t('admin.edit', {
  model: I18n.t('category', { scope: 'activerecord.models' }),
})

const AdminCategoryEdit: React.FC<IProps> = props => {
  const { data: category } = adminService.getDataFromJson(props.category)
  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const { updatedCategory, flush } = await adminService.updateCategory(values)
    // TODO 遷移先でのFlush
    location.href = '/admin/categories'
  }, [])

  return (
    <AdminLayout model="category" title={title}>
      <AdminForm
        fields={FIELDS}
        handleSubmit={handleSubmit}
        indexLink="/admin/categories"
        type="edit"
      >
        <>
          <AdminFormItem>
            <InputText readonly={true} name="id" defaultValue={category.id} label="ID" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText required={true} name="name" defaultValue={category.name} label="Name" />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              required={true}
              name="position"
              defaultValue={category.position}
              label="Position"
            />
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminCategoryEdit
