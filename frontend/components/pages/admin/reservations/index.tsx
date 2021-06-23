import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { EditTable } from '../../../organisms'
import AdminLayout from 'components/layouts/AdminLayout'

interface IProps {
  reservations: {
    reservations: IJsonResponse
  }
}

const options = { scope: 'activerecord.attributes.reservation' }
const COLUMNS = [
  {
    name: I18n.t('id', options),
    field: 'id',
  },
  {
    name: I18n.t('user_id', options),
    field: record => <span>{record.user.id}</span>,
  },
  {
    name: I18n.t('post_id', options),
    field: record => (
      <a href={`/posts/${record.post.slug}`} target="_blank" className="underline">
        {record.post.id}
      </a>
    ),
  },
  {
    name: I18n.t('start_date', options),
    field: 'start_date',
  },
  {
    name: I18n.t('end_date', options),
    field: 'end_date',
  },
  {
    name: I18n.t('workflow_state', options),
    field: record => I18n.t(`enums.reservation.workflow_state.${record.workflow_state}`),
  },
  {
    name: I18n.t('price', options),
    field: 'price',
  },
  {
    name: I18n.t('paid_at', options),
    field: 'paid_at',
  },
  {
    name: I18n.t('canceled_at', options),
    field: 'canceled_at',
  },
  {
    name: I18n.t('created_at', options),
    field: 'created_at',
  },
  {
    name: I18n.t('updated_at', options),
    field: 'updated_at',
  },
  {
    name: I18n.t('refund_amount', options),
    field: 'refund_amount',
  },
  {
    name: I18n.t('authorized_at', options),
    field: 'authorized_at',
  },
]

const Index: React.FC<IProps> = props => {
  const { data, pagination } = adminService.getDataFromJson(props.reservations.reservations)
  return (
    <AdminLayout model="reservation" title={I18n.t('activerecord.models.reservation')}>
      <EditTable editable={true} columns={COLUMNS} records={data} pagination={pagination} />
    </AdminLayout>
  )
}

export default Index
