import * as React from 'react'
import { IReservation } from 'core/interfaces'
import { Button, TextLink } from 'components/atoms'
import I18n from 'core/i18n'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import ReservationCancelModal from 'components/pages/reservations/ReservationCancelModal'
import { ReviewModal } from 'components/molecules'
import ReservationStatusLabel from 'components/pages/reservations/ReservationStatusLabel'
import { getNextWorkFlowButtons } from 'components/pages/reservations/getNextWorkFlowButtons'

interface IProps {
  reservations: IReservation[]
  showPast: boolean
  approveReservation: (id: string | number) => Promise<void>
  declineReservation: (id: string | number) => Promise<void>
  cancelReservation: (id: string | number, params: any) => Promise<void>
  isHost: boolean
}

const ReservationItems: React.FC<IProps> = props => {
  const [isOpenReviewModal, setIsOpenReviewModal] = React.useState(false)
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
  const openReviewModal = React.useCallback((reservation: IReservation) => {
    setSelectedReservation(reservation)
    setIsOpenReviewModal(true)
  }, [])
  const closeReviewModal = React.useCallback(() => {
    setIsOpenReviewModal(false)
    setSelectedReservation(null)
  }, [])

  const renderActionButtons = (reservation: IReservation) => {
    if (props.showPast && reservation.reviewable)
      return (
        <div className="flex justify-end mt-4">
          <div className="w-full lg:w-32 ml-2 first:ml-0">
            <Button
              full
              size="small"
              buttonType="secondary"
              handleClick={() => openReviewModal(reservation)}
            >
              {I18n.t('review.write_review')}
            </Button>
          </div>
        </div>
      )

    if (!props.showPast) {
      const buttons = getNextWorkFlowButtons({
        reservation: reservation,
        approveReservation: props.approveReservation,
        declineReservation: props.declineReservation,
        openCancelModal: openCancelModal,
      })
      return (
        <div className="flex flex-wrap lg:flex-row justify-between mt-4">
          <div className="w-full lg:w-32 mt-3 lg:mt-0 order-last lg:order-none">
            <Button
              full
              buttonType="tertiary"
              size="small"
              iconLeft={<FontAwesomeIcon className="text-base" icon={faComment} />}
              link={`/reservations/${reservation.slug}`}
            >
              {I18n.t('generic.message')}
            </Button>
          </div>
          <div className="flex items-center w-full lg:w-auto">
            {buttons.map((button, i) => (
              <div className="w-full lg:w-25 ml-2 first:ml-0" key={i}>
                {button}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  const getDisplayUser = React.useCallback(
    (reservation: IReservation) => (props.isHost ? reservation.user : reservation.post.user),
    [props.isHost]
  )

  return (
    <React.Fragment>
      <ul>
        {props.reservations.map(reservation => {
          const displayUser = getDisplayUser(reservation)
          return (
            <li className="flex p-4" key={reservation.id}>
              <img
                className="hidden lg:block w-10 h-10 rounded-full object-cover mr-4"
                src={displayUser.avatar_url}
                alt={displayUser.username}
              />

              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img
                      className="lg:hidden w-10 h-10 rounded-full object-cover mr-4"
                      src={displayUser.avatar_url}
                      alt={displayUser.username}
                    />
                    <div className="text-xs font-bold">{displayUser.username}</div>
                    <div className="hidden lg:block ml-3">
                      <ReservationStatusLabel reservation={reservation} />
                    </div>
                  </div>
                  <div className="text-xs">{reservation.created_at}</div>
                </div>

                <div className="lg:hidden mt-1">
                  <ReservationStatusLabel reservation={reservation} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center mt-4 text-sm">
                    <div className="flex items-center">
                      <div>{reservation.start_date}</div>
                      <div className="mx-1">~</div>
                      <div>{reservation.end_date}</div>
                    </div>
                    <div className="ml-3 font-bold">¥{reservation.price}</div>
                  </div>
                  <div className="mt-3 lg:mt-2">
                    <TextLink href={`/posts/${reservation.post.slug}`}>
                      {reservation.post.name}
                    </TextLink>
                  </div>
                </div>

                {renderActionButtons(reservation)}
              </div>
            </li>
          )
        })}
      </ul>
      <ReservationCancelModal
        isOpen={isOpenCancelModal}
        closeModal={closeCancelModal}
        reservation={selectedReservation}
        cancelReservation={props.cancelReservation}
      />
      <ReviewModal
        isOpen={isOpenReviewModal}
        closeModal={closeReviewModal}
        reservation={selectedReservation}
      />
    </React.Fragment>
  )
}

export default ReservationItems
