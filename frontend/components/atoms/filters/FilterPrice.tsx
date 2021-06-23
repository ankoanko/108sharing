import clamp from 'lodash-es/clamp'
import * as React from 'react'
import I18n from 'core/i18n'
import { isTouchDevice } from 'utils/device'
import Slider from '../Slider'
import FilterLayout from 'components/layouts/FilterLayout'

interface IProps {
  name: string

  setIsFilterPanelOpen?(isOpen: boolean): void

  handleOnSubmit(filterValue: any): void
}

interface IPrice {
  min: string
  max: string
}

const initialParams = new URLSearchParams(window.location.search)
const MAX_PRICE = 100000

const FilterPrice: React.FC<IProps> = ({ handleOnSubmit, name, setIsFilterPanelOpen }) => {
  const getInitialValue = (): IPrice => ({
    min: initialParams.has('min_price') ? initialParams.get('min_price') : '',
    max: initialParams.has('max_price') ? initialParams.get('max_price') : '',
  })

  const getLabelText = React.useCallback(
    (updatedPrice: IPrice) => {
      if (!updatedPrice.min && !updatedPrice.max) {
        return name
      }

      const minLabel = updatedPrice.min ? `¥${updatedPrice.min}` : ''
      const maxLabel = updatedPrice.max ? `¥${updatedPrice.max}` : ''
      return [minLabel, maxLabel].join(' 〜 ').trim()
    },
    [name]
  )

  const [isOpen, setIsOpen] = React.useState(false)
  const [price, setPrice] = React.useState<any>(getInitialValue())
  const [labelName, setLabelName] = React.useState(getLabelText(getInitialValue()))
  const [clear, setClear] = React.useState(false)
  const setPanelIsOpen = React.useCallback(
    (open: boolean) => {
      if (open === isOpen) return
      if (setIsFilterPanelOpen) setIsFilterPanelOpen(open)

      setIsOpen(open)
    },
    [isOpen, setIsFilterPanelOpen]
  )

  const setFormatLabelText = React.useCallback(() => {
    setLabelName(getLabelText(price))
  }, [getLabelText, price])

  const hasValue = React.useCallback(() => {
    return price.min || price.max
  }, [price])

  const onClear = () => {
    setPrice({ min: '', max: '' })
    setFormatLabelText()
    setClear(true)
  }

  const onApply = React.useCallback(() => {
    const filterValue: any = {
      min_price: price.min ? price.min : null,
      max_price: price.max ? price.max : null,
    }
    handleOnSubmit(filterValue)
    // TODO API CALL
    setPanelIsOpen(false)
    setFormatLabelText()
  }, [price.min, price.max, handleOnSubmit, setPanelIsOpen, setFormatLabelText])

  const onChangeHandler = React.useCallback(
    event => {
      const changedPrice = {
        ...price,
        [event.target.name]: event.target.value,
      }
      setPrice(changedPrice)
    },
    [price]
  )

  const onBlurHandler = React.useCallback(
    event => {
      const clampedValue =
        event.target.name === 'min'
          ? clamp(
              Number(event.target.value),
              0,
              Number(price.max) || Number(event.target.value) + 1
            )
          : clamp(Number(event.target.value), Number(price.min), MAX_PRICE)
      const changedPrice = {
        ...price,
        [event.target.name]: clampedValue,
      }
      setPrice(changedPrice)
    },
    [price]
  )

  const [dragging, setDragging] = React.useState(false)

  React.useEffect(() => {
    if (clear) {
      setFormatLabelText()
      setClear(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear])

  const onSliderValueChange = changedValue => {
    setPrice({
      min: Math.floor(MAX_PRICE * changedValue.min),
      max: Math.floor(MAX_PRICE * changedValue.max),
    })
  }

  const getSliderValueByPrice = currentPrice => {
    return {
      min: currentPrice.min ? clamp(Number(currentPrice.min) / MAX_PRICE, 0, 1) : 0,
      max: currentPrice.max ? clamp(Number(currentPrice.max) / MAX_PRICE, 0, 1) : 1,
    }
  }

  return (
    <FilterLayout
      hasValue={hasValue()}
      label={labelName}
      onClear={onClear}
      onApply={onApply}
      setPanelIsOpen={setPanelIsOpen}
    >
      {!isTouchDevice() && (
        <div className="px-b mb-4">
          <Slider
            setDragging={setDragging}
            value={getSliderValueByPrice(price)}
            onChangeHandler={onSliderValueChange}
          />
        </div>
      )}
      <form action="">
        <div className="relative flex items-center -mx-2">
          <div className="relative mx-2">
            <span className="absolute left-0 mt-2 ml-3 text-xs">{I18n.t('post.price_min')}</span>
            <span className="absolute top-0 mt-6 ml-3">¥</span>
            <input
              className="block w-40 pt-6 pr-3 pb-2 pl-6 border border-neutral-300 rounded text-sm outline-none appearance-none"
              name="min"
              value={price.min || ''}
              type="text"
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
            />
          </div>
          <span>-</span>
          <div className="relative mx-2">
            <span className="absolute left-0 mt-2 ml-3 text-xs">{I18n.t('post.price_max')}</span>
            <span className="absolute top-0 mt-6 ml-3">¥</span>
            <input
              className="block w-40 pt-6 pr-3 pb-2 pl-6 border border-neutral-300 rounded text-sm outline-none appearance-none"
              name="max"
              value={price.max || ''}
              type="text"
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
            />
          </div>
        </div>
      </form>
    </FilterLayout>
  )
}

export default FilterPrice
