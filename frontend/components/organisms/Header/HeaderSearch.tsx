import React from 'react'
import I18n from '../../../core/i18n'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'

const ENTER_KEYCODE = 13

interface IProps {
  area: string
  keywords: string
  onKeyDownHandler?: React.KeyboardEventHandler<HTMLInputElement>
  onBlurHandler?: React.FormEventHandler<HTMLInputElement>
}

const HeaderSearch: React.FC<IProps> = props => {
  return (
    <div className="max-w-90 flex items-center py-1 px-4 leading-relaxed bg-neutral-100 rounded">
      <label className="w-1/2 flex items-center">
        <FontAwesomeIcon
          className="min-w-3 text-2xl text-neutral-600 mr-3 -mt-2px"
          icon={faMapMarkerAlt}
        />
        <input
          className="bg-neutral-100 outline-none"
          name="area"
          type="text"
          placeholder={I18n.t('generic.area')}
          defaultValue={props.area}
          onBlur={props.onBlurHandler}
          onKeyDown={props.onKeyDownHandler}
        />
      </label>
      <div className="h-6 mx-4 w-1px border-l border-neutral-600" />
      <label className="w-1/2 flex items-center">
        <FontAwesomeIcon
          className="min-w-4 text-2xl text-neutral-600 mr-3 -mt-2px"
          icon={faSearch}
        />
        <input
          className="bg-neutral-100 outline-none"
          name="keywords"
          type="text"
          placeholder={I18n.t('generic.keyword')}
          defaultValue={props.keywords}
          onBlur={props.onBlurHandler}
          onKeyDown={props.onKeyDownHandler}
        />
      </label>
    </div>
  )
}

export default HeaderSearch
