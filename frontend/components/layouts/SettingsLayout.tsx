/** @jsx jsx */
import * as React from 'react'
import { HEADER_HEIGHT } from 'constants/constants'
import SettingsNav, { ActiveTypes } from 'components/pages/settings/SettingsNav'
import { IUser } from 'core/interfaces'
import { css, jsx } from '@emotion/core'

interface IProps {
  main: React.ReactElement
  user: IUser
}

const SettingsLayout: React.FC<IProps> = ({ main, user }) => (
  <div className="lg:flex bg-neutral-200">
    <div className={`hidden lg:block w-50 py-10 border-r border-neutral-300`}>
      <SettingsNav user={user} />
    </div>
    <div
      className="flex-grow lg:w-0 px-4 py-6 lg:py-10 bg-texture"
      css={css`
        min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
      `}
    >
      {main}
    </div>
  </div>
)

export default SettingsLayout
