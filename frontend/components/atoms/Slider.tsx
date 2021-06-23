/** @jsx jsx */

import clamp from 'lodash-es/clamp'
import defer from 'lodash-es/defer'
import * as React from 'react'
import classNames from 'classnames'
import { jsx } from '@emotion/core'

interface IValue {
  min: number | null
  max: number | null
}

interface IProps {
  value: IValue
  setDragging?(dragging: boolean): void
  onChangeHandler?(value: IValue): any
}

const Slider: React.FC<IProps> = ({ value, setDragging, onChangeHandler }) => {
  // FIXME causes error when dragging
  const sliderRef = React.useRef(null)
  const [dragItem, setDragItem] = React.useState(null)
  const [sliderValue, setSliderValue] = React.useState<IValue>({ min: null, max: null })

  // Set slider value by passed value
  React.useEffect(() => {
    const sliderWidth = sliderRef.current.offsetWidth
    setSliderValue({ min: sliderWidth * value.min, max: sliderWidth * value.max })
  }, [value])

  const onDragStart = React.useCallback(
    event => {
      if (dragItem) {
        return
      }
      event.persist()
      const sliderWidth = sliderRef.current.offsetWidth
      const boundingClientRect = sliderRef.current.getBoundingClientRect()
      const value = event.nativeEvent.pageX - boundingClientRect.left
      const targetDragItem =
        Math.abs(sliderValue.min - value) < Math.abs(sliderValue.max - value) ? 'start' : 'end'
      const nextSliderValue =
        targetDragItem === 'start'
          ? { min: value, max: sliderValue.max }
          : { min: sliderValue.min, max: value }

      if (typeof onChangeHandler === 'function') {
        onChangeHandler({
          min: nextSliderValue.min / sliderWidth,
          max: nextSliderValue.max / sliderWidth,
        })
      }

      setDragItem(targetDragItem)
      setSliderValue(nextSliderValue)
      if (typeof setDragging === 'function') {
        setDragging(true)
      }
    },
    [dragItem, sliderValue.min, sliderValue.max, onChangeHandler, setDragging]
  )

  const onDragEnd = React.useCallback(
    event => {
      defer(() => {
        setDragItem(null)
        if (typeof setDragging === 'function') {
          setDragging(false)
        }
      })
    },
    [setDragItem, setDragging]
  )

  React.useEffect(() => {
    const sliderWidth = sliderRef.current.offsetWidth
    const boundingClientRect = sliderRef.current.getBoundingClientRect()

    const onMouseMoveHandler = event => {
      const value = event.pageX - boundingClientRect.left

      setSliderValue(currentValue => {
        const clampedValue =
          dragItem === 'start'
            ? clamp(value, 0, currentValue.max)
            : clamp(value, currentValue.min, sliderWidth)

        const changedValue =
          dragItem === 'start'
            ? { min: clampedValue, max: currentValue.max }
            : { min: currentValue.min, max: clampedValue }

        if (typeof onChangeHandler === 'function') {
          onChangeHandler({
            min: changedValue.min / sliderWidth,
            max: changedValue.max / sliderWidth,
          })
        }

        return changedValue
      })
    }

    if (dragItem) {
      window.addEventListener('mousemove', onMouseMoveHandler)
      window.addEventListener('mouseup', onDragEnd)
      document.body.style.setProperty('-webkit-user-select', 'none')
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMoveHandler)
      window.removeEventListener('mouseup', onDragEnd)
      document.body.style.removeProperty('-webkit-user-select')
    }
  }, [dragItem, onChangeHandler, onDragEnd])

  return (
    <div className="relative h-8 mx-2 cursor-pointer" onMouseDown={onDragStart} ref={sliderRef}>
      {typeof sliderValue.min === 'number' && (
        <div
          className={classNames([
            'absolute top-0 bottom-0 m-auto w-4 h-4 bg-primary rounded-full shadow-icon select-none z-10',
            'left-0 transform -translate-x-1/2',
          ])}
          css={{ left: `${sliderValue.min}px` }}
        />
      )}
      {typeof sliderValue.min === 'number' && typeof sliderValue.max === 'number' && (
        <React.Fragment>
          <div
            className={classNames([
              'absolute inset-y-0 m-auto h-2px',
              'bg-neutral-300 left-0 w-full',
            ])}
          />
          <div
            className={classNames(['absolute inset-y-0 m-auto h-2px', 'bg-primary'])}
            css={{ left: sliderValue.min, width: `${sliderValue.max - sliderValue.min}px` }}
          />
        </React.Fragment>
      )}
      {typeof sliderValue.max === 'number' && (
        <div
          className={classNames([
            'absolute top-0 bottom-0 m-auto w-4 h-4 bg-primary rounded-full shadow-icon select-none z-10',
            'left-100 transform -translate-x-1/2',
          ])}
          css={{ left: `${sliderValue.max}px` }}
        />
      )}
    </div>
  )
}

export default Slider
