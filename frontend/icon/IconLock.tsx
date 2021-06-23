import * as React from 'react'

const SvgIconLock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" height={17} width={14} {...props}>
    <path
      d="M12.25 5.667h-.875v-1.62C11.375 1.814 9.415 0 7 0S2.625 1.813 2.625 4.048v1.619H1.75C.783 5.667 0 6.39 0 7.286v8.095C0 16.275.783 17 1.75 17h10.5c.967 0 1.75-.725 1.75-1.619V7.286c0-.895-.783-1.62-1.75-1.62zM7 12.952c-.967 0-1.75-.724-1.75-1.619 0-.894.783-1.619 1.75-1.619s1.75.725 1.75 1.62c0 .894-.783 1.618-1.75 1.618zm2.712-7.285H4.288v-1.62c0-1.384 1.216-2.509 2.712-2.509s2.712 1.125 2.712 2.51z"
      fill="currentColor"
    />
  </svg>
)

export default SvgIconLock
