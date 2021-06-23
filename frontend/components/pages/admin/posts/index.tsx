import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'

declare let window: IWindow

interface IProps {
  posts: {
    posts: IJsonResponse
  }
}

const COLUMNS = [
  {
    name: 'ID',
    field: 'id',
    required: false,
    readOnly: true,
  },
  {
    name: I18n.t('generic.status'),
    field: record => I18n.t(`enums.post.aasm_state.${record.aasm_state}`),
    required: false,
  },
  {
    name: I18n.t('generic.name'),
    field: record => (
      <a href={`/posts/${record.slug}`} className="block truncate underline" target="_blank">
        {record.name}
      </a>
    ),
    required: true,
    truncate: true,
  },
  {
    name: I18n.t('generic.description'),
    field: 'description',
    required: true,
    truncate: true,
  },
  {
    name: 'Latitude',
    field: 'latitude',
    required: false,
  },
  {
    name: 'Longitude',
    field: 'longitude',
    required: false,
  },
  {
    name: I18n.t('generic.price'),
    field: 'price',
    required: true,
  },
  {
    name: I18n.t('generic.publication_date'),
    field: 'published_at',
    required: false,
  },
]

const AdminPostsIndex: React.FC<IProps> = props => {
  const { data } = adminService.getDataFromJson(props.posts.posts)
  const [posts, setPosts] = React.useState(data)
  const handleDelete = React.useCallback(
    async id => {
      const response = await adminService.deletePost(id)
      const flush = response.data.flush
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
      setPosts(posts.filter(post => post.id !== id))
    },
    [posts]
  )

  return (
    <AdminLayout model="post" title="Posts">
      <EditTable
        editable={true}
        columns={COLUMNS}
        records={posts}
        pagination={props.posts.posts.meta}
        handleDelete={handleDelete}
      />
    </AdminLayout>
  )
}

export default AdminPostsIndex
