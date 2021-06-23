/** @jsx jsx */
import * as React from 'react'
import { IReservation } from 'core/interfaces'
import I18n from 'core/i18n'
import ReservationStatusLabel from 'components/pages/reservations/ReservationStatusLabel'
import { getNextWorkFlowButtons } from 'components/pages/reservations/getNextWorkFlowButtons'
import { useReservations } from 'hooks/useReservations'
import ReservationCancelModal from 'components/pages/reservations/ReservationCancelModal'
import { lineCramp } from 'utils/emotion'
import { css, jsx } from '@emotion/core'

interface IProps {
  reservation: IReservation
}

const ReservationDetail: React.FC<IProps> = props => {
  const {
    reservations,
    cancelReservation,
    approveReservation,
    declineReservation,
  } = useReservations({ runInitialEffect: false, initialReservations: [props.reservation] })
  const reservation = React.useMemo(() => reservations.find(r => r.id === props.reservation.id), [
    reservations,
    props.reservation.id,
  ])

  const [isOpenCancelModal, setIsOpenCancelModal] = React.useState(false)
  const [selectedReservation, setSelectedReservation] = React.useState<null | IReservation>(null)

  const openCancelModal = React.useCallback((reservation: IReservation) => {
    setSelectedReservation(reservation)
    setIsOpenCancelModal(true)
  }, [])

  const closeCancelModal = React.useCallback(() => {
    setIsOpenCancelModal(false)
    setSelectedReservation(null)
  }, [])

  const post = reservation.post
  const owner = reservation.post.user
  const buttons = React.useMemo(
    () =>
      getNextWorkFlowButtons({
        reservation: reservation,
        approveReservation: approveReservation,
        declineReservation: declineReservation,
        openCancelModal: openCancelModal,
      }),
    [reservation, approveReservation, declineReservation, openCancelModal]
  )

  return (
    <div>
      <section className="pt-4 mt-4 border-t border-neutral-300 first:pt-0 first:mt-0 first:border-0">
        {/* TODO mobile proper style */}
        <div className="flex items-center">
          <img
            src={post?.post_images[0].image_url}
            className="w-28 h-28 lg:w-60 lg:h-42 rounded-md object-cover"
            alt={post.name}
          />
          <div className="ml-4 flex-1">
            <div className="text-base lg:text-xl font-bold" css={css(lineCramp(2))}>
              {post?.name}
            </div>
            <div className="flex items-center mt-4">
              <a href={`/user/${post?.user?.username}`}>
                <img
                  className="w-10 h-10 lg:w-16 lg:h-16 object-cover rounded-full"
                  src={owner?.avatar_url}
                  alt={owner.username}
                />
              </a>
              <div className="ml-5 font-bold">{owner?.username}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 mt-4 border-t border-neutral-300 first:pt-0 first:mt-0 first:border-0">
        <div className="mt-4 first:mt-0">
          <div className="text-sm font-bold mb-2">{I18n.t('generic.status')}</div>
          <ReservationStatusLabel reservation={reservation} />
        </div>
        <div className="mt-4 first:mt-0">
          <div className="text-sm font-bold mb-3">{I18n.t('generic.period')}</div>
          <div>
            <span>{reservation.start_date}</span>
            <span className="px-1">~</span>
            <span>{reservation.end_date}</span>
          </div>
        </div>
        <div className="mt-4 first:mt-0">
          <div className="text-sm font-bold mb-3">{I18n.t('reservation.price')}</div>
          <div>¥ {reservation.price}</div>
        </div>
        <div className="mt-4 first:mt-0">
          <div className="text-sm font-bold mb-3">{I18n.t('reservation.remarks_notes')}</div>
          <div className="whitespace-pre-wrap">{post?.note}</div>
        </div>
      </section>

      {!!buttons.length && (
        <React.Fragment>
          <section className="pt-4 mt-4 border-t border-neutral-300 first:pt-0 first:mt-0 first:border-0">
            <div className="flex items-center w-full lg:w-auto justify-center lg:justify-start">
              {buttons.map((button, i) => (
                <div className="w-1/2 lg:w-50 ml-4 first:ml-0" key={i}>
                  {button}
                </div>
              ))}
            </div>
          </section>
          <ReservationCancelModal
            isOpen={isOpenCancelModal}
            closeModal={closeCancelModal}
            reservation={selectedReservation}
            cancelReservation={cancelReservation}
          />
        </React.Fragment>
      )}
    </div>
  )
}

export default ReservationDetail
