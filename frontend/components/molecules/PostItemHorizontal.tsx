/** @jsx jsx */
import { jsx } from '@emotion/core'
import classNames from 'classnames'
import * as React from 'react'
import Score from 'components/atoms/Score'
import { lineCramp } from 'utils/emotion'
import { IPost } from 'core/interfaces'
import Tags from 'components/molecules/Tags'
import { BREAKPOINT_TABLET_LARGE } from 'constants/constants'
import { useMediaQuery } from 'react-responsive'

interface IProps {
  post: IPost
}

const PostItemHorizontal: React.FC<IProps> = props => {
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })

  return (
    <div className={classNames(['flex'])}>
      <img
        className="w-28 h-28 lg:w-60 lg:h-42 object-cover rounded-lg"
        src={props.post.post_images[0].image_url}
        alt={props.post.name}
      />
      <div className={classNames(['flex-grow w-0 ml-4', 'lg:w-auto'])}>
        <div className="flex flex-col">
          <div className="flex justify-between order-first">
            <Score
              score={props.post.avarage_review_score}
              totalCount={props.post.reviews.length}
              size="small"
              omit={!isDesktop}
              className={'lg:hidden'}
            />
            {props.post.category && (
              <div
                className={classNames([
                  'text-neutral-500 order-last text-sm',
                  'lg:text-base lg:-mt-1',
                ])}
              >
                {props.post.category.name}
              </div>
            )}
          </div>

          <h2 className="text-sm font-bold mt-2 lg:mt-5" css={lineCramp(2)}>
            {props.post.name}
          </h2>
          {props.post.tags && (
            <Tags tags={props.post.tags} className="mt-2 order-first lg:order-0" />
          )}
          <Score
            score={props.post.avarage_review_score}
            totalCount={props.post.reviews.length}
            size="small"
            omit={!isDesktop}
            className="mt-6 hidden lg:block"
          />
        </div>
      </div>
    </div>
  )
}

export default PostItemHorizontal
