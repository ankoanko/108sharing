/** @jsx jsx */
import * as React from 'react'
import { useEffect } from 'react'
import * as moment from 'moment'
import 'moment/locale/ja'
import { DayPickerRangeController } from 'react-dates'
import 'react-dates/initialize'
import { css, Global, jsx } from '@emotion/core'
import { IWindow } from 'core/interfaces'
import { Button, InputText, Radio } from 'components/atoms'
import { Form } from 'components/molecules'
import FormItemLayout from 'components/layouts/FormItem'
import { HEADER_HEIGHT } from 'constants/constants'
import I18n from 'core/i18n'
import { usePostEditCalendar } from 'hooks/usePostEditCalendar'
import {
  dateRangePickerCustomStyle,
  defaultCalendarProps,
} from 'constants/dateRangePickerCustomStyle'

declare let window: IWindow

interface IProps {
  post: any
}

interface ISelectedDate {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
}

const MobilePostCalendar: React.FC<IProps> = ({ post }) => {
  const {
    selectedDate,
    data,
    edit,
    focusedInput,
    anyTouched,
    getCalendarCollections,
    clearSelectedDate,
    changeMonth,
    handleSubmit,
    updateInputValue,
    onDateRangePickerChange,
    onFocusChange,
  } = usePostEditCalendar({ post })

  useEffect(() => {
    if (post.id === null) {
      return
    }
    getCalendarCollections(moment().format('YYYY-MM'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  const hasSelectedDates = React.useMemo(
    () => moment.isMoment(selectedDate.start) && moment.isMoment(selectedDate.end),
    [selectedDate]
  )

  const renderDayContents = (dayMoment: moment.Moment) => {
    const found = data.find(d => d.date.isSame(dayMoment, 'day'))

    return (
      <div className="CalendarDay__custom_day_inner relative z-10 flex items-center justify-center h-full">
        <span className={`${found?.blocked ? 'text-neutral-500' : ''}`}>{dayMoment.date()}</span>
        {found?.blocked && (
          <span className="absolute inset-0 m-auto block w-10 h-1px bg-neutral-800 transform -rotate-45" />
        )}
        {found?.reserved && (
          <span className="absolute inset-x-0 bottom-0 m-auto block w-2 h-2 rounded-full bg-primary" />
        )}
      </div>
    )
  }

  const renderDetail = () => {
    if (edit.reserved) {
      return (
        <p className="mt-6 text-sm text-red text-center">
          {I18n.t('calendar.cannot_edit_reserved_days')}
        </p>
      )
    }

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-25 z-99`}>
        <div
          className={`absolute inset-x-0 bottom-0 bg-white rounded-t-xlg shadow-colored-lg`}
          css={css`
            height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
          `}
        >
          <Form
            fields={{ date: 'date', price: 'price', availability: 'availability' }}
            handleSubmit={handleSubmit}
          >
            <div className="px-4 py-8">
              <div>
                <InputText
                  name="date"
                  label={I18n.t('calendar.selected_date')}
                  readonly={true}
                  defaultValue={`${selectedDate.start?.format(
                    'YYYY/MM/DD'
                  )} ~ ${selectedDate.end?.format('YYYY/MM/DD')}`}
                />
              </div>
              <React.Fragment
                key={Object.values(selectedDate ?? {})
                  .map(v => v?.toString())
                  .filter(Boolean)
                  .join('')}
              >
                <div className="mt-4">
                  <InputText
                    name="price"
                    defaultValue={edit.price}
                    onChangeHandler={updateInputValue}
                  />
                </div>
                <div className="mt-4">
                  <FormItemLayout label={I18n.t('calendar.state')} required={false} error={null}>
                    <Radio
                      name="availability"
                      label={I18n.t('calendar.available')}
                      value="available"
                      defaultChecked={edit.availability === 'available'}
                      onChangeHandler={updateInputValue}
                    />
                    <Radio
                      className="mt-2"
                      name="availability"
                      label={I18n.t('calendar.blocked')}
                      value="blocked"
                      defaultChecked={edit.availability === 'blocked'}
                      onChangeHandler={updateInputValue}
                    />
                  </FormItemLayout>
                </div>
              </React.Fragment>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex -mx-2 items-center justify-center h-16 px-4 shadow-footer">
              <div className="px-2 w-full">
                <Button
                  className="w-full"
                  buttonType="secondary"
                  size="small"
                  handleClick={clearSelectedDate}
                >
                  {I18n.t('generic.cancel')}
                </Button>
              </div>
              <div className="px-2 w-full">
                <Button className="w-full" buttonType="primary" size="small" disabled={!anyTouched}>
                  {I18n.t('generic.save')}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="flex justify-center max-w-80 m-auto bg-white shadow-colored-lg rounded-xlg overflow-hidden">
        {/*<Global styles={css(globalStyle)} />*/}
        <Global styles={css(dateRangePickerCustomStyle)} />
        <DayPickerRangeController
          noBorder={true}
          startDate={selectedDate.start}
          endDate={selectedDate.end}
          onDatesChange={onDateRangePickerChange}
          focusedInput={focusedInput ?? 'startDate'}
          onFocusChange={onFocusChange}
          numberOfMonths={1}
          initialVisibleMonth={null}
          onPrevMonthClick={changeMonth}
          onNextMonthClick={changeMonth}
          daySize={38}
          minimumNights={0}
          {...{
            ...defaultCalendarProps,
            renderDayContents,
          }}
        />
      </div>
      {hasSelectedDates && renderDetail()}
    </React.Fragment>
  )
}

export default MobilePostCalendar
