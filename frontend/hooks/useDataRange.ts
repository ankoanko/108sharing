import * as React from 'react'
import I18n from 'core/i18n'
import * as moment from 'moment'

const initialParams = new URLSearchParams(window.location.search)
const getInitialValue = () => ({
  startDate: initialParams.has('start_date') ? moment(initialParams.get('start_date')) : null,
  endDate: initialParams.has('end_date') ? moment(initialParams.get('end_date')) : null,
})

interface ISelectedDate {
  startDate: null | moment.Moment
  endDate: null | moment.Moment
}

export const useDateRange = ({ handleOnSubmit, setPanelIsOpen }) => {
  const [labelName, setLabelName] = React.useState(I18n.t('generic.date'))
  const [selectedDate, setSelectedDate] = React.useState<ISelectedDate>(getInitialValue())

  const hasValue = React.useCallback(
    () => moment.isMoment(selectedDate.startDate) && moment.isMoment(selectedDate.endDate),
    [selectedDate]
  )

  const onDateRangePickerChange = React.useCallback((dates: ISelectedDate) => {
    const updatedSelectedDate = {
      startDate: dates.startDate,
      endDate: dates.endDate,
    }
    setSelectedDate(updatedSelectedDate)
  }, [])

  const onClear = React.useCallback(() => {
    setSelectedDate({ startDate: null, endDate: null })
  }, [])

  const onApply = React.useCallback(() => {
    const hasStartDate = moment.isMoment(selectedDate.startDate)
    const hasEndDate = moment.isMoment(selectedDate.endDate)

    if (hasStartDate && !hasEndDate) {
      setSelectedDate({
        startDate: moment(selectedDate.startDate),
        endDate: moment(selectedDate.startDate).add(1, 'days'),
      })
    }

    const filterValue: any = {
      start_date: hasStartDate ? selectedDate.startDate.format('YYYY-MM-DD') : null,
      end_date: hasEndDate
        ? selectedDate.endDate.format('YYYY-MM-DD')
        : hasStartDate
        ? moment(selectedDate.startDate)
            .add(1, 'days')
            .format('YYYY-MM-DD')
        : null,
    }

    handleOnSubmit(filterValue)
    setPanelIsOpen(false)
  }, [selectedDate, handleOnSubmit, setPanelIsOpen])

  React.useEffect(() => {
    const hasStartDate = moment.isMoment(selectedDate.startDate)
    const hasEndDate = moment.isMoment(selectedDate.endDate)

    if (hasStartDate && hasEndDate) {
      setLabelName(
        `${selectedDate.startDate.format('M月D日')} - ${selectedDate.endDate.format('M月D日')}`
      )
    } else if (hasStartDate && !hasEndDate) {
      setLabelName(`${selectedDate.startDate.format('M月D日')} - `)
    } else {
      setLabelName(I18n.t('generic.date'))
    }
  }, [selectedDate])

  return {
    hasValue,
    labelName,
    onApply,
    onClear,
    onDateRangePickerChange,
    selectedDate,
  }
}
