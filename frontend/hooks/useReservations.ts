import { reservationService } from 'core/services'
import { IReservation, IWindow } from 'core/interfaces'
import { useCallback, useEffect, useState } from 'react'
import {
  createQueryParamStringFromObject,
  getMergedFilterParams,
  removeFalsyKey,
} from 'utils/queryString'

declare let window: IWindow

// TODO browser back対応とか

export const useReservations = (props: {
  runInitialEffect: boolean
  isHost?: boolean
  initialReservations?: IReservation[]
}) => {
  if (props.runInitialEffect && props.isHost == null)
    throw Error('must provide isHost and disableInitialEffect at the same time')

  const initialParams = getMergedFilterParams(['states', 'past', 'page'])
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<IReservation[]>(props.initialReservations ?? [])
  const [meta, setMeta] = useState(null)
  const [states, setStates] = useState([])
  const [showPast, setShowPast] = useState(Boolean(initialParams.past))
  const [page, setPage] = useState(null)

  const getReservations = useCallback(
    async (opt?: { params?: any; pushHistory?: boolean; replaceHistory?: boolean }) => {
      setLoading(true)

      const params = removeFalsyKey({ ...{ states, page, past: showPast }, ...(opt?.params ?? {}) })
      const {
        reservations: searchedReservations,
        pagination,
      } = await reservationService.searchReservations({ ...params, received: !!props.isHost })

      setReservations(searchedReservations)
      setMeta(pagination)

      if (opt?.pushHistory) {
        history.pushState(
          null,
          null,
          window.location.pathname + createQueryParamStringFromObject(params)
        )
      }

      if (opt?.replaceHistory) {
        history.replaceState(
          null,
          null,
          window.location.pathname + createQueryParamStringFromObject(params)
        )
      }

      setLoading(false)
    },
    [states, page, showPast, props.isHost]
  )

  const updateReservations = useCallback(
    updatedReservation => {
      const updatedReservations = reservations.map(reservation =>
        reservation.id === updatedReservation.id ? updatedReservation : { ...reservation }
      )
      setReservations(updatedReservations)
    },
    [reservations, setReservations]
  )

  const approveReservation = useCallback(
    async id => {
      const { reservation, flush } = await reservationService.approveReservation(id)

      updateReservations(reservation)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    },
    [updateReservations]
  )

  const cancelReservation = useCallback(
    async (id, params) => {
      const { reservation, flush } = await reservationService.cancelReservation(id, params)

      updateReservations(reservation)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    },
    [updateReservations]
  )

  const declineReservation = useCallback(
    async id => {
      const { reservation: reservation, flush } = await reservationService.declineReservation(id)

      updateReservations(reservation)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    },
    [updateReservations]
  )

  useEffect(() => {
    if (props.runInitialEffect) {
      getReservations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    loading,
    reservations,
    meta,
    getReservations,
    updateReservations,
    cancelReservation,
    approveReservation,
    declineReservation,
    states,
    setStates,
    showPast,
    setShowPast,
    page,
    setPage,
  }
}
