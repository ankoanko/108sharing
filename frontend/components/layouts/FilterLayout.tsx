/** @jsx jsx */
import classNames from 'classnames'
import 'moment/locale/ja'
import * as React from 'react'
import ClickOutside from 'react-click-outside'
import I18n from 'core/i18n'
import { BREAKPOINT_TABLET_LARGE, HEADER_HEIGHT } from 'constants/constants'
import { useMediaQuery } from 'react-responsive'
import { css, jsx } from '@emotion/core'

interface IProps {
  hasValue: boolean
  label: string

  onClear(): void

  onApply(): void

  right?: boolean
  setPanelIsOpen?(isOpen: boolean): void
}

const FilterLayout: React.FC<IProps> = ({
  hasValue,
  label,
  onClear,
  onApply: propOnApply,
  right,
  setPanelIsOpen,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const onApply = React.useCallback(
    e => {
      setIsOpen(false)
      propOnApply()
    },
    [propOnApply]
  )
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })

  return (
    <ClickOutside className="inline-block" onClickOutside={() => setIsOpen(false)}>
      <div className="relative">
        <div
          className={classNames([
            'flex items-center text-sm px-3 mx-1 h-9 border rounded-full cursor-pointer',
            isOpen || hasValue ? 'border-primary bg-primary-light' : 'bg-white border-neutral-300',
          ])}
          onClick={() => {
            setIsOpen(!isOpen)
            setPanelIsOpen(!isOpen)
          }}
        >
          {label}
        </div>
        {isOpen && (
          <div
            className={classNames([
              isDesktop &&
                'absolute left-0 top-100 mx-3 p-4 bg-white border border-neutral-300 rounded-xlg shadow-colored-lg',
              right ? 'right-0' : 'left-0',
              !isDesktop && 'fixed inset-0 bg-white p-4 z-1',
            ])}
            css={css(
              isDesktop
                ? {}
                : {
                    top: `${HEADER_HEIGHT}px`,
                    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                  }
            )}
          >
            {children}
            <div className="flex justify-between mt-4">
              <div
                className={classNames('text-neutral-500 font-bold cursor-pointer', {
                  disabled: !hasValue,
                })}
                onClick={onClear}
              >
                {I18n.t('generic.clear')}
              </div>
              <div className="text-primary font-bold cursor-pointer" onClick={onApply}>
                {I18n.t('generic.apply')}
              </div>
            </div>
          </div>
        )}
      </div>
    </ClickOutside>
  )
}

export default FilterLayout
