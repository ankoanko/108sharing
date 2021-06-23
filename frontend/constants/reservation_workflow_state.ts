import I18n from 'core/i18n'

export const ReservationWorkFlowState = {
  Canceled: 'canceled',
  Approved: 'approved',
  Declined: 'declined',
  Requested: 'requested',
} as const

type TReservationWorkFlowState = typeof ReservationWorkFlowState[keyof typeof ReservationWorkFlowState]
type TReservationWorkFlowStateConfig = Record<TReservationWorkFlowState, { name: any; color: any }>

export const RESERVATION_WORKFLOW_STATE_CONFIG: TReservationWorkFlowStateConfig = {
  canceled: {
    name: I18n.t('enums.reservation.workflow_state.canceled'),
    color: 'neutral-400',
  },
  approved: {
    name: I18n.t('enums.reservation.workflow_state.approved'),
    color: 'green',
  },
  declined: {
    name: I18n.t('enums.reservation.workflow_state.declined'),
    color: 'neutral-400',
  },
  requested: {
    name: I18n.t('enums.reservation.workflow_state.requested'),
    color: 'blue',
  },
}
