import * as React from 'react'
import ModalLayout from 'components/layouts/ModalLayout'
import { IReservation } from 'core/interfaces'
import I18n from 'core/i18n'
import { Form } from 'components/molecules'
import { Button, InputTextArea } from 'components/atoms'
import { reservationService } from 'core/services'

interface IProps {
  isOpen: boolean
  closeModal: () => void
  reservation: IReservation
  cancelReservation: (id, values) => Promise<void>
}

const ReservationCancelModal: React.FC<IProps> = props => {
  const [sending, setSending] = React.useState(false)
  const [errors, setErrors] = React.useState<{ [key: string]: null | string }>({ reason: null })
  const [refundAmount, setRefundAmount] = React.useState(null)
  React.useEffect(() => {
    setRefundAmount(null)
    if (!props.reservation) return
    reservationService.refundAmountReservation(props.reservation.id).then(({ price }) => {
      setRefundAmount(price)
    })
  }, [props.reservation])

  return (
    <ModalLayout
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      title={I18n.t('cancel.cancel_reservation')}
    >
      <div>
        {refundAmount != null && (
          <div className="mb-3">
            {refundAmount > 0 ? (
              <p>{I18n.t('cancel.cancel_reservation_confirmation', { price: refundAmount })}</p>
            ) : (
              <p>{I18n.t('cancel.cancel_reservation_no_price')}</p>
            )}
          </div>
        )}
        <Form
          fields={{ reason: 'reason' }}
          handleUpdateForm={(updatedErrors, isSubmitEnabled) => {
            setErrors(updatedErrors)
          }}
          handleSubmit={async (initialValues, values) => {
            setSending(true)
            await props.cancelReservation(props.reservation.id, values)
            setSending(false)
            props.closeModal()
          }}
        >
          <div className="font-bold">{I18n.t('cancel.cancel_reason')}</div>
          <InputTextArea name="reason" error={errors.reason} defaultValue="" />
          <div className="flex justify-center mt-6">
            <div className="w-25 ml-4 first:ml-0">
              <Button size="small" buttonType="muted" type="button" handleClick={props.closeModal}>
                {I18n.t('generic.close')}
              </Button>
            </div>
            <div className="w-25 ml-4 first:ml-0">
              <Button size="small" buttonType="primary-filled" disabled={sending}>
                {I18n.t('generic.cancel')}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </ModalLayout>
  )
}

export default ReservationCancelModal
