import * as React from 'react'
import { useCallback, useState } from 'react'
import * as moment from 'moment'
import { IPost, IWindow } from 'core/interfaces'
import * as constants from 'constants/constants'
import range from 'lodash-es/range'
import { postService } from 'core/services'
import classNames from 'classnames'

declare let window: IWindow

interface IDay {
  date: moment.Moment
  blocked: boolean
  reserved: boolean
  price: number
  selected?: boolean
  start?: boolean
  end?: boolean
}

interface ISelectedDate {
  start: null | moment.Moment
  end: null | moment.Moment
}

interface IEdit {
  reserved: boolean
  price: string
  availability: string
}

type FocusedInput = null | 'startDate' | 'endDate'

interface IProps {
  post: IPost
}

const getJsonData = (selectedYearMonth: moment.Moment, post: IPost): IDay[] => {
  const year = selectedYearMonth.year()
  const month = selectedYearMonth.month()
  const daysInMonth = selectedYearMonth.daysInMonth()

  return range(daysInMonth).map((count: number) => ({
    date: moment([year, month, count + 1]),
    blocked: false,
    reserved: false,
    price: post.price_numeric ?? 0,
  }))
}

const isInRange = (day: IDay, start: moment.Moment, end: moment.Moment) => {
  return day.date.isSameOrAfter(start.startOf('day')) && day.date.isSameOrBefore(end.startOf('day'))
}

const isMomentItems = (items: any[]): boolean => {
  return !items.some(item => !moment.isMoment(item))
}

export const usePostEditCalendar = ({ post }: IProps) => {
  const [yearMonth, setYearMonth] = useState<moment.Moment>(
    moment([moment().year(), moment().month(), 1])
  )
  const [selectedDate, setSelectedDate] = useState<ISelectedDate>({ start: null, end: null })
  const [dragItem, setDragItem] = useState<null | moment.Moment>(null)
  const [data, setData] = useState<IDay[]>(getJsonData(moment(), post))
  const [edit, setEdit] = useState<IEdit>({
    reserved: false,
    price: String(constants.DEFAULT_PRICE),
    availability: 'available',
  })
  const [focusedInput, setFocusedInput] = useState<FocusedInput>(null)
  const [anyTouched, setAnyTouched] = useState(false)
  const [fetching, setFetching] = useState(false)

  const getCalendarCollections = useCallback(
    async (yyyyMM: string, newData?: IDay[]) => {
      setFetching(true)
      const { calendarCollections } = await postService.getCalendarCollections(post.id, {
        month: yyyyMM,
        reserved: true,
        defined_price: true,
        blocked: true,
      })
      const nextData = newData ?? [...data]

      calendarCollections.forEach(collection => {
        const date = moment(collection.day)

        nextData.some((data, index) => {
          if (data.date.isSame(date)) {
            nextData[index] = {
              date: data.date,
              blocked: collection.blocked,
              price: collection.daily_price || data.price,
              reserved: collection.reserved,
            }

            return true
          }
        })
      })

      setFetching(false)
      setData(nextData)
    },
    [data, post.id]
  )

  const clearSelectedDate = useCallback(() => {
    const nextData = data.map((day: IDay) => ({
      ...day,
      selected: false,
      start: false,
      end: false,
    }))

    setSelectedDate({ start: null, end: null })
    setData(nextData)
    setAnyTouched(false)
  }, [data])

  const changeMonth = useCallback(
    (date: moment.Moment) => {
      const newData = getJsonData(date, post)

      clearSelectedDate()
      setYearMonth(date)
      setData(newData)
      getCalendarCollections(date.format('YYYY-MM'), newData)
    },
    [clearSelectedDate, getCalendarCollections, post]
  )

  const onChangeMonthSelector = useCallback(
    (event: React.FormEvent<HTMLSelectElement | HTMLButtonElement>) => {
      const element = event.currentTarget
      const date = moment(element.value)
      if (yearMonth.isSame(date)) {
        return
      }
      changeMonth(date)
    },
    [changeMonth, yearMonth]
  )

  const handleSubmit = useCallback(async () => {
    const { start, end } = selectedDate

    if (!isMomentItems([start, end])) {
      return
    }

    const params = []
    const { price, availability } = edit
    const blocked = availability !== 'available'
    const newData = data.map((day: IDay) => {
      const nextDay = {
        ...day,
        selected: false,
        start: false,
        end: false,
      }

      if (isInRange(day, start, end)) {
        const nextPrice = price === '' ? day.price : Number(price)
        const nextBlocked = availability === '' ? day.blocked : blocked

        nextDay.price = nextPrice
        nextDay.blocked = nextBlocked

        params.push({
          blocked: nextBlocked,
          reserved: day.reserved,
          daily_price: nextPrice,
          day: day.date.format('YYYY/MM/DD'),
        })
      }

      return nextDay
    })

    setData(newData)
    setSelectedDate({ start: null, end: null })
    setAnyTouched(false)

    const { flush } = await postService.createCollectionCalendar(post.id, params)
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }, [data, edit, post.id, selectedDate])

  const updateDateSelection = useCallback(
    (selectedDate: ISelectedDate) => {
      const { start, end } = selectedDate

      if (!isMomentItems([start, end])) {
        return
      }

      const nextData = data.map((day: IDay) => {
        const selectedStartDate = start.format(constants.DATE_FORMAT)
        const selectedEndDate = end.format(constants.DATE_FORMAT)

        if (day.date.isSameOrAfter(selectedStartDate) && day.date.isSameOrBefore(selectedEndDate)) {
          // 選択範囲内
          const formatDate = day.date.format(constants.DATE_FORMAT)
          const nextDay = {
            ...day,
            selected: true,
            start: formatDate === selectedStartDate,
            end: formatDate === selectedEndDate,
          }

          return nextDay
        } else {
          // 選択範囲外
          return {
            ...day,
            selected: false,
          }
        }
      })

      setData(nextData)
    },
    [data]
  )

  const updateInputValue = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const newEdit = { ...edit }
      const input = event.currentTarget as HTMLInputElement
      newEdit[input.name] = input.value

      setAnyTouched(true)
      setEdit(newEdit)
    },
    [edit]
  )

  const getCalendarClassNames = useCallback(() => {
    const { start, end } = selectedDate

    return classNames({
      hasSelectedDate: start && end,
    })
  }, [selectedDate])

  const onDragStart = useCallback(
    (day: IDay, index: number) => {
      const { start, end } = selectedDate
      const hasBothDate = isMomentItems([start, end])
      const inRange = hasBothDate && isInRange(day, start, end)
      if (hasBothDate) {
        if (inRange) {
          // すでに選択されている日付内をクリックした場合、startかend近い方をドラッグ可能に
          const distanceToStart = Math.abs(day.date.diff(start, 'days'))
          const distanceToEnd = Math.abs(day.date.diff(end, 'days'))
          const startIsClose = distanceToStart <= distanceToEnd
          const newSelectedDate = {
            start: startIsClose ? day.date : start,
            end: startIsClose ? end : day.date,
          }

          updateDateSelection(newSelectedDate)

          setDragItem(startIsClose ? end : start)
          setSelectedDate(newSelectedDate)
          return
        } else {
          // すでに選択されている日付があり、範囲外をクリックした場合 選択された日付をリセット
          clearSelectedDate()
        }
      } else {
        // 日付を選択
        const newSelectedDate = {
          start: day.date,
          end: day.date,
        }

        const nextData = [...data]
        nextData[index] = {
          ...nextData[index],
          selected: true,
          start: true,
          end: true,
        }

        setDragItem(day.date)
        setSelectedDate(newSelectedDate)
        setEdit({
          reserved: day.reserved,
          price: String(day.price),
          availability: day.blocked === true ? 'blocked' : 'available',
        })
        setData(nextData)
      }
    },
    [clearSelectedDate, data, selectedDate, updateDateSelection]
  )

  const updateSelectedDate = useCallback(
    (date: ISelectedDate) => {
      const newSelectedDate = { ...selectedDate, ...date }
      setSelectedDate(newSelectedDate)

      if (!isMomentItems(Object.values(newSelectedDate))) {
        return
      }

      const newEdit = { ...edit }
      const { start, end } = newSelectedDate

      const nextData = data.map((item: IDay) => {
        if (isInRange(item, start, end)) {
          return {
            ...item,
            selected: true,
            start: item.date.isSame(start),
            end: item.date.isSame(end),
          }
        } else {
          return {
            ...item,
            selected: false,
          }
        }
      })

      const dataInRange = data.filter(item => isInRange(item, start, end))

      // 複数選択されている日付の値段が共通の場合inputに値を表示
      const haveSamePrice = !dataInRange.some(item => item.price !== dataInRange[0].price)
      if (haveSamePrice) {
        newEdit.price = String(dataInRange[0].price)
      } else {
        newEdit.price = ''
      }

      // 複数選択されている日付の利用可否が共通の場合にradioを選択
      const haveSameAvailability = !dataInRange.some(
        (item: IDay) => item.blocked !== dataInRange[0].blocked
      )
      if (haveSameAvailability) {
        newEdit.availability = dataInRange[0].blocked === true ? 'blocked' : 'available'
      } else {
        newEdit.availability = ''
      }

      // 予約されている日付を含む場合は編集不可に
      newEdit.reserved = dataInRange.some((item: IDay) => item.reserved === true)

      setEdit(newEdit)
      setData(nextData)
    },
    [data, edit, selectedDate]
  )

  const onDrag = useCallback(
    (day: IDay) => {
      if (!dragItem) {
        return
      }

      const date: ISelectedDate = { start: null, end: null }
      if (day.date.isAfter(dragItem)) {
        date.start = dragItem
        date.end = day.date
      } else {
        date.start = day.date
        date.end = dragItem
      }
      updateSelectedDate(date)
    },
    [dragItem, updateSelectedDate]
  )

  const onDragEnd = useCallback(() => setDragItem(null), [])

  // DateRangePicker変更時
  const onDateRangePickerChange = useCallback(
    (dates: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
      const selectedDate = {
        start: dates.startDate,
        end: dates.endDate,
      }

      updateSelectedDate(selectedDate)
      updateDateSelection(selectedDate)
    },
    [updateDateSelection, updateSelectedDate]
  )

  const onFocusChange = useCallback((currentFocusedInput: null | 'startDate' | 'endDate') => {
    setFocusedInput(currentFocusedInput)
  }, [])

  return {
    yearMonth,
    selectedDate,
    data,
    edit,
    focusedInput,
    anyTouched,
    fetching,
    getCalendarCollections,
    clearSelectedDate,
    changeMonth,
    onChangeMonthSelector,
    handleSubmit,
    updateInputValue,
    getCalendarClassNames,
    onDragStart,
    onDrag,
    onDragEnd,
    onDateRangePickerChange,
    onFocusChange,
  }
}
