import * as React from 'react'

const SvgIconCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1zM4 8h16V7c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v1z"
      fill="#333"
    />
  </svg>
)

export default SvgIconCard
