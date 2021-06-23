import * as React from 'react'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import I18n from 'core/i18n'
import {
  dateRangePickerCustomStyle,
  defaultCalendarProps,
} from 'constants/dateRangePickerCustomStyle'
import { DateRangePicker } from 'react-dates'
import { Button } from 'components/atoms'
import { postService } from 'core/services'
import { DATE_FORMAT } from 'constants/constants'
import * as moment from 'moment'
import { IPost } from 'core/interfaces'
import { PostReservationPeriod, PostShowPageType } from 'components/pages/posts/show/index'
import { css, Global } from '@emotion/core'

interface IProps {
  post: IPost
  isSignedIn: boolean
  changePage: (page: PostShowPageType, period?: PostReservationPeriod) => void
  setShowReservationPanel?(showReservationPanel: boolean): void
}

const PostDetailSidebarContent: React.FC<IProps> = props => {
  const [focusedInput, setFocusedInput] = React.useState(null)
  const [calendarEvents, setCalendarEvents] = React.useState([])
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<PostReservationPeriod>({
    start: null,
    end: null,
  })

  const getCalculate = React.useCallback(
    async currentSelectedDate => {
      const { price } = await postService.getCalculation(props.post.id, {
        start_date: currentSelectedDate.start.format(DATE_FORMAT),
        end_date: currentSelectedDate.end.format(DATE_FORMAT),
      })
      setTotalPrice(price)
    },
    [props.post.id]
  )

  const onDateRangePickerChange = React.useCallback(
    (dates: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
      const changedDate = {
        start: dates.startDate,
        end: dates.endDate,
      }

      setSelectedDate(changedDate)

      if (moment.isMoment(dates.startDate) && moment.isMoment(dates.endDate)) {
        getCalculate(changedDate)
      }
    },
    [getCalculate]
  )

  const getCalendarEvents = React.useCallback(
    async yearMonth => {
      const { calendarCollections } = await postService.getCalendarCollections(props.post.id, {
        month: yearMonth,
        blocked: true,
        reserved: true,
      })
      setCalendarEvents(calendarCollections)
    },
    [props.post.id]
  )

  React.useEffect(() => {
    getCalendarEvents(moment().format('YYYY-MM'))
  }, [getCalendarEvents])

  const onDateRangePickerMonthChange = React.useCallback(
    async changedMoment => {
      const changedYearMonth = changedMoment.format('YYYY-MM')
      getCalendarEvents(changedYearMonth)
    },
    [getCalendarEvents]
  )

  const handleCalendarDayBlocked = React.useCallback(
    calendarMoment => {
      const formattedDate = calendarMoment.format('YYYY-MM-DD')
      const matchedEvent = calendarEvents.find(event => event.day === formattedDate)
      if (!matchedEvent) return false

      const available = matchedEvent?.blocked === false && matchedEvent?.reserved === false
      return !available
    },
    [calendarEvents]
  )

  const handleReservation = React.useCallback(() => {
    if (!moment.isMoment(selectedDate.start) || !moment.isMoment(selectedDate.end)) {
      setFocusedInput('startDate')
      return
    }

    if (props.setShowReservationPanel) props.setShowReservationPanel(false)
    props.changePage('reservation', selectedDate)
  }, [props, selectedDate])

  return (
    <div>
      {PAYMENT_REQUIRED && (
        <div className="text-xl font-bold mb-6">
          ¥ {props.post.price} <span>{I18n.t('generic.per_day')}</span>
        </div>
      )}
      <div className="text-sm mb-1">{I18n.t('date.label')}</div>
      <Global styles={css(dateRangePickerCustomStyle)} />
      <DateRangePicker
        startDate={selectedDate.start}
        startDateId="startDate"
        endDate={selectedDate.end}
        endDateId="endDate"
        onDatesChange={onDateRangePickerChange}
        focusedInput={focusedInput}
        onFocusChange={(currentFocusedInput: string | null) => setFocusedInput(currentFocusedInput)}
        isDayBlocked={handleCalendarDayBlocked}
        numberOfMonths={1}
        onPrevMonthClick={onDateRangePickerMonthChange}
        onNextMonthClick={onDateRangePickerMonthChange}
        {...defaultCalendarProps}
      />
      {totalPrice && PAYMENT_REQUIRED && (
        <div className="mt-3">
          <div className="text-sm mb-1">{I18n.t('generic.total')}</div>
          <div className="font-bold">¥ {totalPrice}</div>
        </div>
      )}
      {props.isSignedIn ? (
        <Button className="mt-4" full handleClick={handleReservation}>
          {I18n.t('generic.reservation')}
        </Button>
      ) : (
        <Button className="mt-4" link="/users/sign_in" full>
          {I18n.t('generic.login')}
        </Button>
      )}
    </div>
  )
}

export default PostDetailSidebarContent
