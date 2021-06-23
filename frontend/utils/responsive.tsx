import React from 'react'
import Responsive from 'react-responsive'
import * as constants from '../constants/constants'

export const Desktop = props => <Responsive {...props} minWidth={constants.BREAKPOINT_DESKTOP} />
export const MobileOrTablet = props => (
  <Responsive {...props} maxWidth={constants.BREAKPOINT_DESKTOP - 1} />
)
