import * as React from 'react'
import I18n from 'core/i18n'
import { Button } from 'components/atoms'
import { IReservation } from 'core/interfaces'

interface IProps {
  reservation: IReservation
}

const ReservationCompleted: React.FC<IProps> = props => {
  return (
    <div>
      <h2 className="text-xl font-bold text-center">
        {I18n.t('reservation.reservation_completed')}
      </h2>
      <div className="mt-8">
        <Button
          buttonType="secondary"
          link={`/reservations/${props.reservation?.slug}`}
          className="mx-auto"
        >
          {I18n.t('reservation.to_messages')}
        </Button>
      </div>
    </div>
  )
}

export default ReservationCompleted
