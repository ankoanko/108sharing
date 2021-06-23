import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'
import * as moment from 'moment'

interface IProps {
  contacts: {
    contacts: IJsonResponse
  }
}

const COLUMNS = [
  {
    name: I18n.t('generic.email'),
    field: 'email',
  },
  {
    name: I18n.t('contact.subject'),
    field: 'subject',
  },
  {
    name: I18n.t('contact.body'),
    field: 'body',
    preWrap: true,
  },
  {
    name: I18n.t('generic.username'),
    field: 'name',
  },
  {
    name: I18n.t('generic.created_at'),
    field: record => <span>{moment(record.created_at).format('YYYY/MM/DD hh:mm')}</span>,
  },
]

const AdminContactsIndex: React.FC<IProps> = props => {
  const { data } = adminService.getDataFromJson(props.contacts.contacts)
  return (
    <AdminLayout model="contact" title={I18n.t('activerecord.models.contact')}>
      <EditTable
        editable={false}
        columns={COLUMNS}
        records={data}
        pagination={props.contacts.contacts.meta}
      />
    </AdminLayout>
  )
}

export default AdminContactsIndex
