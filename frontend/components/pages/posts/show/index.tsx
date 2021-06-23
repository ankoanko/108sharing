import * as React from 'react'
import { IJsonResponse, IUser, IWindow } from 'core/interfaces'
import { postService } from 'core/services'
import injectGoogleMaps from 'utils/injectGoogleMaps'
import ReservationNew from 'components/pages/reservations/new/index'
import PostDetail from 'components/pages/posts/show/PostDetail'
import I18n from 'core/i18n'
import moment from 'moment'
import { createQueryParamStringFromObject } from 'utils/queryString'
import { usePosts } from 'hooks/usePosts'

interface IProps {
  user: IUser
  isSignedIn: boolean
  post: IJsonResponse
  post_owner: IUser
  editable: boolean
  isOwner: boolean
  identification_required: boolean
  profile_required: boolean
}

declare let window: IWindow
export type PostReservationPeriod = { start: moment.Moment; end: moment.Moment }
export type PostShowPageType = string | 'show' | 'reservation'
const DEFAULT_PAGE = 'show'

export const PostShow: React.FC<IProps> = props => {
  const { post: initialPost } = postService.getPostFromJson(props.post)
  const { posts, toggleLike } = usePosts({
    initialPosts: [initialPost],
  })
  const [period, setPeriod] = React.useState<PostReservationPeriod>(null)
  const [page, setPage] = React.useState<PostShowPageType>(
    new URLSearchParams(window.location.search).get('page') ?? DEFAULT_PAGE
  )

  const initFromQueryParams = React.useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const page = urlParams.get('page')
    const start = urlParams.get('start')
    const end = urlParams.get('end')
    setPage(page ?? DEFAULT_PAGE)
    if (start && end) {
      setPeriod({
        start: moment(parseInt(start, 10)),
        end: moment(parseInt(end, 10)),
      })
    }
  }, [setPage, setPeriod])

  const changePage = React.useCallback(
    (page: PostShowPageType, period?: PostReservationPeriod) => {
      if (page === 'reservation') {
        if (props.isOwner) {
          window.flashMessages.addMessage({
            text: I18n.t('post.cannot_reserve_own_post'),
            type: 'error',
          })
          return
        }

        if (props.identification_required) {
          window.globalModal.showModal({
            title: '',
            body: <p>{I18n.t('settings.set_identification_for_reservation')}</p>,
            closeText: I18n.t('generic.cancel'),
            submitText: I18n.t('settings.set_identification'),
            handleSubmit: () => (location.href = '/settings/identification'),
          })
          return
        } else if (props.profile_required) {
          window.globalModal.showModal({
            title: '',
            body: <p>{I18n.t('settings.set_profile_for_reservation')}</p>,
            closeText: I18n.t('generic.cancel'),
            submitText: I18n.t('settings.set_profile'),
            handleSubmit: () => (location.href = '/settings/profile'),
          })
          return
        }
      }

      setPeriod(period)
      setPage(page)
      const queryParamsStr = createQueryParamStringFromObject({
        start: period?.start,
        end: period?.end,
        page: page,
      })
      history.pushState(null, null, queryParamsStr)
    },
    [props.identification_required, props.isOwner, props.profile_required]
  )

  React.useEffect(() => {
    initFromQueryParams()
    window.addEventListener('popstate', initFromQueryParams)
    return () => window.removeEventListener('popstate', initFromQueryParams)
  }, [initFromQueryParams])

  if (page === 'reservation' && period) {
    return (
      <ReservationNew
        post={posts[0]}
        startDate={period.start}
        endDate={period.end}
        changePage={changePage}
      />
    )
  } else {
    return (
      <PostDetail
        user={props.user}
        isSignedIn={props.isSignedIn}
        post={posts[0]}
        post_owner={props.post_owner}
        editable={props.editable}
        isOwner={props.isOwner}
        identification_required={props.identification_required}
        profile_required={props.profile_required}
        page={page}
        changePage={changePage}
        toggleLike={toggleLike}
      />
    )
  }
}

export default injectGoogleMaps(PostShow)
