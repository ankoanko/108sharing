import * as React from 'react'
import { IReservation } from 'core/interfaces'
import { RESERVATION_WORKFLOW_STATE_CONFIG } from 'constants/reservation_workflow_state'

interface IProps {
  reservation: IReservation
}

const ReservationStatusLabel: React.FC<IProps> = props => {
  const status = RESERVATION_WORKFLOW_STATE_CONFIG[props.reservation.workflow_state]

  return (
    <span className={`px-2 py-1 text-2xs leading-none rounded bg-${status.color} bg-opacity-10`}>
      {status.name}
    </span>
  )
}

export default ReservationStatusLabel
