import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'

declare let window: IWindow

interface IProps {
  categories: {
    categories: IJsonResponse
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
    name: I18n.t('generic.name'),
    field: 'name',
    required: true,
  },
  {
    name: I18n.t('generic.position'),
    field: 'position',
    required: false,
  },
]

const AdminCategoryIndex: React.FC<IProps> = props => {
  const { data, pagination } = adminService.getDataFromJson(props.categories.categories)
  const [categories, setCategories] = React.useState(data)
  const handleDelete = React.useCallback(
    async id => {
      const { flush } = await adminService.deleteCategory(id)
      // TODO 成功レスポンスと揃えたい
      window.flashMessages.addMessage({
        text: flush.message,
        type: flush.type,
      })
      setCategories(categories.filter(category => category.id !== id))
    },
    [categories]
  )

  return (
    <AdminLayout
      model="category"
      title={I18n.t('activerecord.models.category')}
      link="/admin/categories/new"
      linkText={I18n.t('generic.create_new')}
    >
      <EditTable
        editable={true}
        columns={COLUMNS}
        records={categories}
        pagination={pagination}
        handleDelete={handleDelete}
        getEditLink={id => `/admin/categories/${id}/edit`}
      />
    </AdminLayout>
  )
}

export default AdminCategoryIndex
