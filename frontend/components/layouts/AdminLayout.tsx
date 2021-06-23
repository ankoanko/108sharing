/** @jsx jsx */
import * as React from 'react'
import { HEADER_HEIGHT } from 'constants/constants'
import { Button, Panel } from 'components/atoms'
import AdminNav, { ActiveTypes } from 'components/pages/admin/AdminNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { css, jsx } from '@emotion/core'

interface IProps {
  model: ActiveTypes
  title: string
  link?: string
  linkText?: string
}

const AdminLayout: React.FC<IProps> = props => {
  const titleElement = (
    <div className="flex justify-between">
      <div>{props.title}</div>
      {props.link && props.linkText && (
        <div className="w-34">
          <Button size="small" link={props.link} iconLeft={<FontAwesomeIcon icon={faPlus} />}>
            {props.linkText}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="lg:flex bg-neutral-200">
      <div className="sticky hidden lg:block w-50 py-3 py-10 bg-black-admin text-white">
        <div
          className="sticky"
          css={css`
            top: ${HEADER_HEIGHT + 40}px;
          `}
        >
          <AdminNav active={props.model} />
        </div>
      </div>
      <div
        className="flex-grow lg:w-0 px-4 lg:px-10 py-6 lg:py-10 mx-auto"
        css={css`
          min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
        `}
      >
        <Panel title={titleElement} contentFull={true} wrapperFull={true}>
          {props.children}
        </Panel>
      </div>
    </div>
  )
}

export default AdminLayout
