import * as React from 'react'
import { Button } from 'components/atoms'
import I18n from 'core/i18n'
import { IReservation } from 'core/interfaces'
import * as moment from 'moment'

interface IProps {
  reservation: IReservation
  approveReservation: (id: string | number) => Promise<void>
  declineReservation: (id: string | number) => Promise<void>
  openCancelModal: (reservation: IReservation) => void
}

export const getNextWorkFlowButtons = (props: IProps): React.ReactElement[] => {
  const today = moment().startOf('day')
  const reservationEndDateMoment = moment(props.reservation.end_date, 'YYYY年MM月DD日')
  const isPast = reservationEndDateMoment.isBefore(today)
  if (!props.reservation.next_work_flow_state || isPast) {
    return []
  }

  return props.reservation.next_work_flow_state.map((state, index) => {
    switch (state) {
      case 'approved':
        return (
          <Button
            full
            key={`${props.reservation.id}-${index}`}
            buttonType="primary-filled"
            size="small"
            handleClick={() => props.approveReservation(props.reservation.id)}
          >
            {I18n.t('generic.approve')}
          </Button>
        )
      case 'declined':
        return (
          <Button
            full
            key={`${props.reservation.id}-${index}`}
            buttonType="muted"
            size="small"
            handleClick={() => props.declineReservation(props.reservation.id)}
          >
            {I18n.t('generic.decline')}
          </Button>
        )
      case 'canceled':
        return (
          <Button
            full
            key={`${props.reservation.id}-${index}`}
            buttonType="muted"
            size="small"
            handleClick={() => props.openCancelModal(props.reservation)}
          >
            {I18n.t('cancel.cancel_reservation')}
          </Button>
        )
    }
  })
}
