import { COLORS } from 'constants/colors'
import * as moment from 'moment'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'

// TODO: move somewhere to avoid using .tsx extension
export const defaultCalendarProps = {
  monthFormat: 'YYYY年M月',
  renderDayContents: (day: moment.Moment, _) => (
    <div className="CalendarDay__custom_day_inner">{day.format('D')}</div>
  ),
  navPrev: (
    <div className="absolute top-0 left-0 mt-5 mx-6 text-primary w-8 h-8 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  ),
  navNext: (
    <div className="absolute top-0 right-0 mt-5 mx-6 text-primary w-8 h-8 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  ),
  hideKeyboardShortcutsPanel: true,
}

const sharedStyle = `
  .CalendarDay {
    border-radius: 9999px;
    background-size: 80%;
    background-position: center;
  }
  .CalendarDay.CalendarDay__default {
    border: none;
  }
  .CalendarDay__selected_span {
    background: ${COLORS.PrimaryLight};
    border: none;
    border-radius: 0;
    color: ${COLORS.Text};
    position: relative;
  }
  .CalendarDay__selected {
    background-color: ${COLORS.Primary};
    border: none;
    color: white;
  }
  .CalendarDay__selected:hover {
    background-color: ${COLORS.Primary};
    color: white;
  }
  .CalendarDay__hovered_span:hover,
  .CalendarDay__hovered_span {
    background: ${COLORS.PrimaryLight};
    border: none;
    border-radius: 0;
  }
  
  .CalendarDay__selected_start,
  .CalendarDay__selected_end {
    position: relative;
    font-weight: bold;
    
    &:before {
      content: "";
      background-color: ${COLORS.PrimaryLight};
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: absolute;
    }
    
    &:after {
      content: "";
      background-color: ${COLORS.Primary};
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: absolute;
      border-radius: 9999px;
    }
  }
  .CalendarDay__selected_start:before {
    left: 50%;
  }
  .CalendarDay__selected_end:before {
    right: 50%;
  }  
  
  .CalendarDay.CalendarDay__blocked_calendar {
    background: ${COLORS['Neutral-300']};
    border: none;
    color: ${COLORS['Neutral-500']};
  }
  
  .CalendarDay__custom_day_inner {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .DayPickerNavigation_custom_prev,
  .DayPickerNavigation_custom_next {
    position: absolute;    
    top: 24px;
  }
  
  .DayPickerNavigation_custom_prev {
    left: 38px;
  }
  .DayPickerNavigation_custom_next {
    right: 38px;
  }
`

export const dateRangePickerCustomStyle = `
  .DateRangePicker.DateRangePicker_1 {
    width: 100%;
  }
  .DateRangePickerInput.DateRangePickerInput_1 {
    display: flex;
    align-items: center;
    width: 100%;
    border: solid 1px ${COLORS.Border};
  }
  .DateInput.DateInput_1 {
    width: 50%;
  }
  input#startDate,
  input#endDate {
    &.DateInput_input__focused {
      border-bottom: solid 1px ${COLORS.Primary};
    }
  }
  ${sharedStyle}
`

export const dateRangePickerCustomStyleOnForm = `
  .DateRangePicker {
    display: block;
  }
  .DateRangePickerInput {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: ${COLORS['Neutral-100']};
    border:none;
  }
  .DateInput {
    background-color: transparent;
    flex-grow: 1;
    width: 0;
  }
  .DateInput_input {
    font-size: 14px;
    border: none;
    background-color: transparent;
    padding: 10px;
    color: inherit;
    font-weight: normal;
  }
  .DateRangePickerInput_arrow {
    svg {
      display: none;
    }
    &:after {
      content: "→";
    }
  }
  ${sharedStyle}
`
