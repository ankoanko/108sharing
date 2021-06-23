import * as React from 'react'

const SvgIconClose = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" height={16} width={16} {...props}>
    <g stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
      <path d="M1 14.435L14.435 1M1 1l13.435 13.435" />
    </g>
  </svg>
)

export default SvgIconClose
