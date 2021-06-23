import * as React from 'react'
import I18n from 'core/i18n'
import { IPost } from 'core/interfaces'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import classNames from 'classnames'
import ReservationCompleted from 'components/pages/reservations/new/ReservationCompleted'
import ReservationForm from 'components/pages/reservations/new/ReservationForm'
import moment from 'moment'
import { postService } from 'core/services'
import { DATE_FORMAT } from 'constants/constants'
import PostItemHorizontal from 'components/molecules/PostItemHorizontal'
import { PostReservationPeriod, PostShowPageType } from 'components/pages/posts/show'

interface IProps {
  post: IPost
  startDate: moment.Moment
  endDate: moment.Moment
  changePage: (page: PostShowPageType, period?: PostReservationPeriod) => void
}

const ReservationNew: React.FC<IProps> = ({ post, startDate, endDate, changePage }) => {
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [createdReservation, setCreatedReservation] = React.useState(null)
  const [totalPrice, setTotalPrice] = React.useState(0)

  const getCalculate = React.useCallback(
    async currentSelectedDate => {
      const { price } = await postService.getCalculation(post.id, {
        start_date: currentSelectedDate.start.format(DATE_FORMAT),
        end_date: currentSelectedDate.end.format(DATE_FORMAT),
      })
      setTotalPrice(price)
    },
    [post.id]
  )

  React.useEffect(() => {
    if (PAYMENT_REQUIRED) {
      getCalculate({ start: startDate, end: endDate })
    }
  }, [getCalculate, endDate, startDate])

  return (
    <div className="container pt-6 pb-10">
      <div
        className={classNames([
          'bg-white',
          'lg:py-12 lg:px-16 lg:px-4 lg:rounded-xlg lg:shadow-colored-lg',
        ])}
      >
        <div>
          {isCompleted ? (
            <ReservationCompleted reservation={createdReservation} />
          ) : (
            <>
              <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
                <PostItemHorizontal post={post} />
              </section>
              <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
                <h3 className="text-xl font-bold mb-3">
                  {I18n.t('reservation.reservation_detail')}
                </h3>
                <dl>
                  <dt className="text-sm lg:text-base font-bold mb-3">
                    {I18n.t('generic.period')}
                  </dt>
                  <dd className="mb-4">
                    {/* FIXME: Support I18n */}
                    {startDate.format('YYYY年M月D日')} ~ {endDate.format('YYYY年M月D日')}
                  </dd>
                  {PAYMENT_REQUIRED && !!totalPrice && (
                    <>
                      <dt className="text-sm lg:text-base font-bold mb-3">
                        {I18n.t('generic.price')}
                      </dt>
                      <dd className="mb-4">¥ {totalPrice}</dd>
                    </>
                  )}
                  <dt className="text-sm lg:text-base font-bold mb-3">
                    {I18n.t('reservation.remarks_notes')}
                  </dt>
                  <dd className="whitespace-pre-wrap">
                    <p>{post.note}</p>
                  </dd>
                </dl>
              </section>

              <ReservationForm
                post={post}
                setCreatedReservation={setCreatedReservation}
                setIsCompleted={setIsCompleted}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationNew
