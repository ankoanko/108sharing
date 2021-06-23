import * as React from 'react'
import FilterLayout from 'components/layouts/FilterLayout'
import { CheckBox } from 'components/atoms'

interface IType {
  id: number | string
  name: string
}

interface IProps {
  field: string
  name: string
  types: IType[]
  setIsFilterPanelOpen?(isOpen: boolean): void
  handleOnSubmit(filterValue: any): void
  maxLabelItemCount?: number
  right?: boolean
}

const initialParams = new URLSearchParams(window.location.search)
const DEFAULT_MAX_LABEL_ITEM_COUNT = 3

const FilterType: React.FC<IProps> = ({
  field,
  name,
  types: propsTypes,
  setIsFilterPanelOpen,
  handleOnSubmit,
  maxLabelItemCount: propsMaxLabelItemCount,
  right,
}) => {
  const maxLabelItemCount = propsMaxLabelItemCount ?? DEFAULT_MAX_LABEL_ITEM_COUNT
  const getInitialValue = () =>
    initialParams.has(`${field}[]`) ? initialParams.getAll(`${field}[]`) : []
  const [isOpen, setIsOpen] = React.useState(false)
  const [types, setTypes] = React.useState(getInitialValue())
  const [labelName, setLabelName] = React.useState(name)
  const setPanelIsOpen = React.useCallback(
    (open: boolean) => {
      if (open === isOpen) return
      if (setIsFilterPanelOpen) setIsFilterPanelOpen(open)
      setIsOpen(open)
    },
    [isOpen, setIsFilterPanelOpen]
  )

  const onChangeHandler = event => {
    const value = event.target.value

    if (event.target.checked) {
      if (!types.includes(value)) {
        setTypes([...types, value])
      }
    } else {
      if (types.includes(value)) {
        setTypes(types.filter(type => type !== value))
      }
    }
  }

  React.useEffect(() => {
    if (!types.length) return setLabelName(name)

    const activeTypes = propsTypes
      .map(t => (types.includes(String(t.id)) ? t.name : null))
      .filter(t => t !== null)
    const isOmitted = activeTypes.length > maxLabelItemCount
    setLabelName(`${activeTypes.slice(0, maxLabelItemCount).join(', ')}${isOmitted ? '…' : ''}`)
  }, [types, propsTypes, maxLabelItemCount, name])

  const hasValue = () => !!types.length
  const onClear = () => {
    setTypes([])
  }
  const onApply = React.useCallback(() => {
    handleOnSubmit({ [field]: types })
    setPanelIsOpen(false)
  }, [handleOnSubmit, field, types, setPanelIsOpen])

  return (
    <FilterLayout
      hasValue={hasValue()}
      label={labelName}
      onClear={onClear}
      onApply={onApply}
      right={right}
      setPanelIsOpen={setPanelIsOpen}
    >
      <form action="">
        <div>
          {propsTypes.map(type => (
            <div className="mt-3 first:mt-0" key={type.id}>
              <CheckBox
                name={'type_ids'}
                value={String(type.id)}
                onChangeHandler={onChangeHandler}
                checked={types.includes(String(type.id))}
                label={type.name}
              />
            </div>
          ))}
        </div>
      </form>
    </FilterLayout>
  )
}

export default FilterType
