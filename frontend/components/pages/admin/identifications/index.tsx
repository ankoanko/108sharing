import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { IJsonResponse } from '../../../../core/JsonApiSerializer'
import { adminService } from '../../../../core/services'
import { Button } from '../../../atoms'
import AdminLayout from 'components/layouts/AdminLayout'
import { EditTable } from 'components/organisms'

declare let window: IWindow

interface IProps {
  identifications: {
    identifications: IJsonResponse
  }
}

const COLUMNS = [
  {
    name: I18n.t('generic.user'),
    field: record => record.user.username,
  },
  {
    name: I18n.t('generic.image'),
    field: record => (
      <div className="flex items-center flex-wrap my-2 p-4 bg-neutral-100">
        {record.identification_images.map(image => (
          <div key={image.id} className="w-1/2 p-4 max-w-64">
            <a
              href={image.image_url}
              target="_blank"
              className="block transition duration-150 hover:opacity-85"
            >
              <img key={image.id} src={image.image_url} alt="" />
            </a>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: I18n.t('generic.status'),
    field: record => I18n.t(`enums.identification.workflow_state.${record.workflow_state}`),
  },
]

const AdminIdentificationsIndex: React.FC<IProps> = props => {
  const { identifications: initialIdentifications } = adminService.getIdentificationsFromJson(
    props.identifications.identifications
  )
  const [identifications, setIdentifications] = React.useState(initialIdentifications)
  const filteredIdentifications = React.useMemo(() => {
    return identifications.filter(identification => {
      return identification.workflow_state === 'requested'
    })
  }, [identifications])

  const approveIdentification = React.useCallback(
    async identification => {
      const {
        identification: approvedIdentification,
        flush,
      } = await adminService.approveIdentification(identification.id)
      setIdentifications(
        identifications.map(item =>
          item.id === approvedIdentification.id ? approvedIdentification : { ...item }
        )
      )
      if (window && window.flashMessages) {
        window.flashMessages.addMessage({ text: flush.message, type: flush.type })
      }
    },
    [identifications]
  )

  const declineIdentification = React.useCallback(
    async identification => {
      const {
        identification: declinedIdentification,
        flush,
      } = await adminService.declineIdentification(identification.id)
      setIdentifications(
        identifications.map(item =>
          item.id === declinedIdentification.id ? declinedIdentification : { ...item }
        )
      )
      if (window && window.flashMessages) {
        window.flashMessages.addMessage({ text: flush.message, type: flush.type })
      }
    },
    [identifications]
  )

  const actionColumn = {
    name: I18n.t('generic.action'),
    field: record => (
      <>
        <Button type="button" size="small" handleClick={() => approveIdentification(record)}>
          {I18n.t('generic.approve')}
        </Button>
        <Button
          className="mt-3"
          type="button"
          buttonType="muted"
          size="small"
          handleClick={() => declineIdentification(record)}
        >
          {I18n.t('generic.decline')}
        </Button>
      </>
    ),
  }

  return (
    <AdminLayout model="identification" title={I18n.t('activerecord.models.identification')}>
      <EditTable
        editable={false}
        columns={[...COLUMNS, actionColumn]}
        records={filteredIdentifications}
      />
    </AdminLayout>
  )
}

export default AdminIdentificationsIndex
