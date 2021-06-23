import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IWindow } from '../../../../core/interfaces'
import { reservationService } from '../../../../core/services'
import { InputTextArea } from '../../../atoms'
import { Form } from '../../../molecules'

declare let window: IWindow

interface IProps {
  price: number
  formRef: any
  reservationId: number
  setReservation(reservaton: any): void
}

const CancelModal: React.FC<IProps> = props => {
  const [modalErrors, setModalErrors] = React.useState<{ [key: string]: null | string }>({
    reason: null,
  })
  const onCancelHandler = async (id, params) => {
    const { reservation: canceledReservation, flush } = await reservationService.cancelReservation(
      id,
      params
    )

    props.setReservation(canceledReservation)
    window.globalModal.closeModal()
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  return (
    <div>
      {props.price > 0 ? (
        <p>{I18n.t('cancel.cancel_reservation_confirmation', { price: props.price })}</p>
      ) : (
        <p>{I18n.t('cancel.cancel_reservation_no_price')}</p>
      )}
      <Form
        ref={props.formRef}
        fields={{ reason: 'reason' }}
        handleUpdateForm={updatedErrors => {
          setModalErrors(updatedErrors)
        }}
        handleSubmit={(initialValues, values) => {
          onCancelHandler(props.reservationId, values)
        }}
      >
        <InputTextArea
          name="reason"
          label={I18n.t('cancel.cancel_reason')}
          error={modalErrors.reason}
          defaultValue=""
        />
      </Form>
    </div>
  )
}

export default CancelModal
