import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'

declare let window: IWindow

interface IProps {
  tags: {
    tags: IJsonResponse
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

const AdminTagIndex: React.FC<IProps> = props => {
  const { data, pagination } = adminService.getDataFromJson(props.tags.tags)
  const [tags, setTags] = React.useState(data)
  const handleDelete = React.useCallback(
    async id => {
      const response = await adminService.deleteTag(id)
      // TODO 成功レスポンスと揃えたい
      window.flashMessages.addMessage({
        text: response.data.flush.message,
        type: response.data.flush.type,
      })
      setTags(tags.filter(tag => tag.id !== id))
    },
    [tags]
  )

  return (
    <AdminLayout
      model="tag"
      title={I18n.t('activerecord.models.tag')}
      link="/admin/tags/new"
      linkText={I18n.t('generic.create_new')}
    >
      <EditTable
        editable={true}
        columns={COLUMNS}
        records={tags}
        pagination={pagination}
        handleDelete={handleDelete}
        getEditLink={id => `/admin/tags/${id}/edit`}
      />
    </AdminLayout>
  )
}

export default AdminTagIndex
