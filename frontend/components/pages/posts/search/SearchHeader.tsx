/** @jsx jsx */
import classNames from 'classnames'
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import I18n from 'core/i18n'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { postService } from 'core/services'
import { BREAKPOINT_TABLET_LARGE, HEADER_HEIGHT, SEARCH_HEADER_HEIGHT } from 'constants/constants'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import { FilterDateRange, FilterPrice, Toggle, FilterType } from 'components/atoms'
import { useMediaQuery } from 'react-responsive'

interface ISearchHeaderProps {
  categories: IJsonResponse
  tags: IJsonResponse
  showMap?: boolean
  handleOnFilterSubmit(params: any): void
  setShowMap?(showMap: boolean): void
}

const SearchHeader: React.FC<ISearchHeaderProps> = props => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false)
  const { data: categories } = postService.getDataFromJson(props.categories)
  const { data: tags } = postService.getDataFromJson(props.tags)
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })

  return (
    <React.Fragment>
      <div
        className={classNames([
          'fixed inset-x-0 z-10 flex justify-between h-14 py-2 px-6 bg-white border-b border-neutral-300',
          'lg:overflow-visible scrolling-touch lg:scrolling-auto',
          // SPで、フィルター操作中にスクロール状態が切り替わると一瞬スクロールが見えるので特殊なことをしています
          isFilterPanelOpen ? 'overflow-x-hidden' : 'overflow-x-auto',
        ])}
        css={css`
          top: ${HEADER_HEIGHT}px;
          // SP実機でFilter内のFixedが貫通してくれないため、SPフィルター表示中にこのヘッダーも同じ高さにしています
          height: ${!isDesktop && isFilterPanelOpen ? `calc(100vh - ${HEADER_HEIGHT}px)` : ''};
        `}
      >
        <div className="-mx-1 whitespace-no-wrap">
          <FilterDateRange
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            handleOnSubmit={props.handleOnFilterSubmit}
          />
          {PAYMENT_REQUIRED && (
            <FilterPrice
              name={I18n.t('generic.price')}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
              handleOnSubmit={props.handleOnFilterSubmit}
            />
          )}
          <FilterType
            name={I18n.t('generic.category')}
            field="category_ids"
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            handleOnSubmit={props.handleOnFilterSubmit}
            types={categories}
          />
          <FilterType
            name={I18n.t('generic.tag')}
            field="tag_ids"
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            handleOnSubmit={props.handleOnFilterSubmit}
            types={tags}
          />
        </div>
        {props.setShowMap && (
          <div className="hidden items-center lg:flex">
            <span className="mr-3 text-sm">{I18n.t('button.show_map')}</span>
            <Toggle
              name="toggle_map"
              checked={props.showMap}
              onChangeHandler={() => {
                props.setShowMap(!props.showMap)
              }}
            />
          </div>
        )}
      </div>
      {/* spacing */}
      <div
        className="w-full"
        css={css`
          height: ${SEARCH_HEADER_HEIGHT}px;
        `}
      />
    </React.Fragment>
  )
}

export default SearchHeader
