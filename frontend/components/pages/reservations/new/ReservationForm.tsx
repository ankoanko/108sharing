import * as React from 'react'
import { IPost, IWindow } from 'core/interfaces'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import { reservationService } from 'core/services'
import { Form } from 'components/molecules'
import I18n from 'core/i18n'
import { Button, InputTextArea } from 'components/atoms'
import StripeCardSelect from 'components/organisms/StripeCardSelect'
import moment from 'moment'

declare let window: IWindow

interface IErrors {
  [key: string]: string | null
}

interface IProps {
  post: IPost

  setIsCompleted(flag: boolean): void

  setCreatedReservation(reservation: any): void

  startDate: moment.Moment
  endDate: moment.Moment
  totalPrice?: number
}

const FIELDS = { initial_message: 'initial_message' }

const ReservationForm: React.FC<IProps> = ({
  post,
  totalPrice,
  endDate,
  startDate,
  setCreatedReservation,
  setIsCompleted,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [errors, setErrors] = React.useState<IErrors>({})
  const [getStripeParams, setStripeParamsGetter] = React.useState<any>(null)

  const handleUpdateForm = (updatedErrors, isSubmitEnabled) => {
    setErrors(updatedErrors)
  }

  const handleSubmit = React.useCallback(
    async (initialValues, values) => {
      setIsProcessing(true)

      let params = {
        reservation: {
          start_date: startDate,
          end_date: endDate,
          price: totalPrice ?? 0,
          post_id: post.id,
          initial_message: values.initial_message,
        },
      }

      if (PAYMENT_REQUIRED && typeof getStripeParams === 'function') {
        const stripeParams = await getStripeParams().catch(() => null)
        if (!stripeParams) {
          window.flashMessages.addMessage({
            text: I18n.t('generic.confirm_payment_method'),
            type: 'error',
          })
          setIsProcessing(false)
          return
        }
        params = { ...params, ...stripeParams }
      }

      const createReservationResponse = await reservationService.createReservation({ ...params })

      if (createReservationResponse.reservation) {
        setCreatedReservation(createReservationResponse.reservation)
        setIsCompleted(true)
      }
    },
    [
      endDate,
      getStripeParams,
      post.id,
      setCreatedReservation,
      setIsCompleted,
      startDate,
      totalPrice,
    ]
  )

  return (
    <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
      <section className="py-4 lg:py-8 border-neutral-300 border-t">
        <h3 className="text-xl font-bold mb-3">{I18n.t('reservation.send_message_to_host')}</h3>
        <div className="flex item-center">
          <img
            className="w-16 h-16 object-cover rounded-full"
            src={post.user.avatar_url}
            alt={post.user.username}
          />
          <div className="flex-grow ml-4">
            <div className="font-bold">{post.user.username}</div>
            <div className="text-sm mt-1 text-neutral-670">
              {I18n.t('avatar.avatar_created_at', { created_at: post.user.created_at })}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <InputTextArea
            required={true}
            name="initial_message"
            defaultValue=""
            error={errors.initial_message}
          />
        </div>
      </section>

      <section className="py-4 lg:py-8 border-neutral-300 border-t">
        {PAYMENT_REQUIRED && <StripeCardSelect setStripeParamsGetter={setStripeParamsGetter} />}
        <div className="flex justify-center mt-6">
          <Button disabled={isProcessing}>
            {I18n.t(PAYMENT_REQUIRED ? 'button.pay' : 'generic.reservation')}
          </Button>
        </div>
      </section>
    </Form>
  )
}

export default ReservationForm
