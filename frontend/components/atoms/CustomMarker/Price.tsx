import * as React from 'react'
import { IPost } from 'core/interfaces'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import { PRICE_MARKER_CLASSNAME } from './Marker'

interface IMarkerProps {
  post: IPost
}

const Price: React.FC<IMarkerProps> = props => {
  return (
    <div
      className={`${PRICE_MARKER_CLASSNAME} py-2 px-3 rounded-full leading-none bg-white border border-neutral-300 shadow hover:text-primary`}
    >
      {PAYMENT_REQUIRED ? <>¥ {props.post.price}</> : 'Post'}
    </div>
  )
}

export default Price
