import * as React from 'react'
import { useReviews } from 'hooks/useReviews'
import I18n from 'core/i18n'
import PostImages from 'components/pages/posts/show/PostImages'
import { Score } from 'components/atoms'
import { Review } from 'components/molecules'
import PostDetailSideBar from 'components/pages/posts/show/PostDetailSideBar'
import RelatedPosts from 'components/pages/posts/show/RelatedPosts'
import { IPost, IUser } from 'core/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt'
import { IconStar } from 'icon'
import { BREAKPOINT_TABLET_LARGE } from 'constants/constants'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import PostDetailSpSideBar from 'components/pages/posts/show/PostDetailSpSideBar'
import { PostReservationPeriod, PostShowPageType } from 'components/pages/posts/show/index'
import { Desktop, MobileOrTablet } from 'utils/responsive'
import Collapse from 'components/atoms/Collapse'

interface IInitializeMapProp {
  lat: number
  lng: number
  div: HTMLDivElement
  name: string
}

const initializeMap = ({ lat, lng, div, name }: IInitializeMapProp) => {
  if (!lat || !lng) {
    return
  }
  const latlng = new google.maps.LatLng(lat, lng)
  const options = {
    zoom: 15,
    center: latlng,
    mapTypeId: 'roadmap',
    scrollwheel: false,
    draggable: false,
  }
  const initializedMap = new google.maps.Map(div, options)

  new google.maps.Marker({
    position: latlng,
    title: name,
    map: initializedMap,
  })
}

interface IProps {
  user: IUser
  isSignedIn: boolean
  post: IPost
  post_owner: IUser
  editable: boolean
  isOwner: boolean
  identification_required: boolean
  profile_required: boolean
  page: string
  changePage: (page: PostShowPageType, period?: PostReservationPeriod) => void
  toggleLike(post: IPost): void
}
const PostDetail: React.FC<IProps> = props => {
  const [showReservationPanel, setShowReservationPanel] = React.useState(false)
  const { reviews, updateReviews } = useReviews({ initialReviews: props.post.reviews })
  const gMapRef = React.createRef<HTMLDivElement>()
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })

  React.useEffect(() => {
    const shouldRunInitMap =
      google && gMapRef.current.childElementCount === 0 && props.page === 'show'
    if (shouldRunInitMap) {
      initializeMap({
        lat: props.post.latitude,
        lng: props.post.longitude,
        name: props.post.name,
        div: gMapRef.current,
      })
    }
  }, [gMapRef, props.page, props.post.latitude, props.post.longitude, props.post.name])

  return (
    <div>
      {props.editable && (
        <div className="flex items-center h-12 px-6 text-white font-bold bg-orange">
          <p>{I18n.t('post.it_is_your_post')}</p>
          <a className="ml-3 text-white underline" href={`/posts/${props.post.slug}/edit`}>
            {I18n.t('generic.edit')}
          </a>
        </div>
      )}

      <div className="container flex pt-8 pb-0">
        <div className="flex-1 lg:mr-6">
          <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
            <PostImages post={props.post} toggleLike={props.toggleLike} />
            <div className="flex">
              <div className="hidden lg:block mr-6">
                <a href={`/user/${props.post.user.username}`} target="_blank">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={props.post.user.avatar_url}
                    alt=""
                  />
                  {/*<div className="mt-3 text-center">{props.post.user.username}</div>*/}
                </a>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl leading-snug lg:leading-normal">
                  {props.post.name}
                </h2>
                <div className="flex items-center mt-2 lg:justify-between lg:flex-row-reverse">
                  {(props.post.state || props.post.city) && (
                    <div
                      className={classNames([
                        'flex items-center ml-3 order-last',
                        'lg:ml-0 lg:order-0',
                      ])}
                    >
                      <FontAwesomeIcon
                        className="text-sm lg:text-lg text-neutral-600 mr-2 -mt-2px"
                        icon={faMapMarkerAlt}
                      />
                      <span>{[props.post.state, props.post.city].join(', ')}</span>
                    </div>
                  )}
                  <Score
                    score={props.post.avarage_review_score}
                    size={isDesktop ? 'large' : 'small'}
                    totalCount={reviews.length}
                    omit={!isDesktop}
                  />
                </div>
              </div>
            </div>
            {props.post?.tags?.length > 0 && (
              <ul className="flex flex-wrap -mx-1 overflow-hidden mt-2">
                {props.post.tags.map(tag => (
                  <li
                    key={tag.id}
                    className="m-1 py-2 px-3 font-medium text-primary text-sm leading-none rounded bg-primary-light"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
            <Collapse type="normal">
              <p className="text-sm lg:text-base whitespace-pre-wrap">{props.post.description}</p>
            </Collapse>
          </section>

          {props.post.latitude && props.post.longitude && (
            <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
              <h3 className="text-xl font-bold mb-4 lg:mb-6">{I18n.t('generic.area')}</h3>
              <div ref={gMapRef} className="h-80 md:h-112" />
            </section>
          )}

          <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
            <h3 className="text-xl font-bold mb-4 lg:mb-6">
              {I18n.t('review.review_count', { count: reviews.length })}
            </h3>

            <div className="mt-6">
              <Score score={props.post.avarage_review_score} size={'medium'} textSize={'large'} />
            </div>
            {!!reviews.length && (
              <div className="mt-12">
                {reviews.map((review, i) => (
                  <div
                    key={i}
                    className="mt-6 pt-6 first:mt-0 first:pt-0 border-t border-neutral-300 first:border-0"
                  >
                    <Review
                      review={{ ...review, reviewable: props.post }}
                      showPostLink={false}
                      updateReviews={updateReviews}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="py-4 lg:py-8 first:pt-0 border-neutral-300 border-t first:border-0">
            <h3 className="text-xl font-bold mb-4 lg:mb-6">{I18n.t('generic.about_host')}</h3>
            <div>
              <div className="flex items-center">
                <div className="mr-6">
                  <a href={`/user/${props.post.user.username}`} target="_blank">
                    <img
                      className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded-full"
                      src={props.post.user.avatar_url}
                      alt=""
                    />
                  </a>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold lg:mb-1">{props.post.user.username}</h4>
                  <div className="text-sm lg:text-base text-neutral-670">
                    {I18n.t('avatar.avatar_created_at', { created_at: props.post.user.created_at })}
                  </div>
                  {props.post.user.reviews_count && (
                    <div className="flex items-center text-sm lg:text-base text-neutral-670">
                      <IconStar width={17} height={16} className="mr-1 text-neutral-600" />
                      <div>
                        {I18n.t('generic.review_count', { count: props.post.user.reviews_count })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm mt-2 lg:text-base lg:mt-8">{props.post.user.bio}</p>
            </div>
          </section>
        </div>

        <Desktop>
          <PostDetailSideBar
            post={props.post}
            isSignedIn={props.isSignedIn}
            isOwner={props.isOwner}
            userLiked={props.post.user_liked}
            changePage={props.changePage}
            toggleLike={props.toggleLike}
          />
        </Desktop>
        <MobileOrTablet>
          <PostDetailSpSideBar
            post={props.post}
            showReservationPanel={showReservationPanel}
            setShowReservationPanel={setShowReservationPanel}
            changePage={props.changePage}
            isSignedIn={props.isSignedIn}
          />
        </MobileOrTablet>
      </div>

      <div className="container">
        <div className="pt-8 pb-16 border-t border-neutral-300">
          <RelatedPosts post={props.post} />
        </div>
      </div>
    </div>
  )
}

export default PostDetail
