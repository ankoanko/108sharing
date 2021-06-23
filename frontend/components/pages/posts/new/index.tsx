/** @jsx jsx */
import * as React from 'react'
import I18n from 'core/i18n'
import { Desktop, MobileOrTablet } from 'utils/responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { postService } from 'core/services'
import { Button, Panel } from 'components/atoms'
import { Calendar, FlashMessage } from 'components/organisms'
import MobilePostCalendar from 'components/organisms/Calendar/mobile'
import Address from './Address'
import BasicInfo from './BasicInfo'
import Images from './Images'
import { HEADER_HEIGHT } from 'constants/constants'
import { css, jsx } from '@emotion/core'
import { IPost, IWindow } from 'core/interfaces'
import StateChangeModal from './StateChangeModal'
import classNames from 'classnames'

// interface IWindow {
//   flashMessages: FlashMessage
//   location: any
//   onpopstate: any
//   google: any
// }
export interface IState {
  id: number
  label: string
  value: string
}
declare let window: IWindow

interface IProps {
  post: any
  isNew: boolean
  categories: any
  tags: any
  conditions: any
}

const NAV_ITEMS = [
  {
    type: 'info',
    icon: faListUl,
  },
  {
    type: 'address',
    icon: faMapMarkerAlt,
  },
  {
    type: 'images',
    icon: faImage,
  },
  {
    type: 'calendar',
    icon: faCalendarAlt,
  },
]

const PostNew: React.FC<IProps> = props => {
  const { post: parsedPost } = postService.getPostFromJson(props.post)
  const currentImages = parsedPost.post_images || []
  const initialImages = currentImages.map((image: any) => ({
    id: image.id,
    url: image.image_url,
    description: image.description,
  }))
  const [images, setImages] = React.useState(initialImages)
  const [page, setPage] = React.useState('info')
  const [post, setPost] = React.useState<IPost>(parsedPost)
  const [isNew, setIsNew] = React.useState(props.isNew)
  const { data: categories } = postService.getDataFromJson(props.categories)
  const { data: tags } = postService.getDataFromJson(props.tags)
  const { data: conditions } = postService.getDataFromJson(props.conditions)
  const InitState = {
    id: parsedPost.id,
    label: parsedPost.aasm_state_i18n,
    value: parsedPost.aasm_state,
  }
  const [publishState, setPublishState] = React.useState<IState>(InitState)

  const changePage = changedPage => {
    setPage(changedPage)
    history.pushState(null, null, `?active=${changedPage}`)
  }

  const changePageFromParam = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const active = urlParams.get('active')

    if (active) {
      setPage(active)
    }
  }

  React.useEffect(() => {
    changePageFromParam()
    window.onpopstate = () => {
      changePageFromParam()
    }
  }, [])

  const handleFormSubmit = async (initialValues, values) => {
    const params = { ...values }
    const currentValues = {}
    Object.keys(values).forEach(key => {
      currentValues[key] = String(props.post[key])
    })

    if (parsedPost) {
      params.id = parsedPost.id
    }

    if (params.price) {
      params.price = Number(params.price.replace(/[^0-9]/g, ''))
    }

    if (isNew) {
      const { edit_post_path } = await postService.create(params)
      location.href = edit_post_path
    } else {
      const { post: updatedPost, flush } = await postService.update(params)
      setPost(updatedPost)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    }
  }

  // const publishPost = async () => {
  //   const { post_path } = await postService.publish(parsedPost)
  //   location.href = post_path
  // }

  const getInputStatus = currentPage => {
    const status = { valid: true, message: '' }
    const requiredFields = ['zipcode', 'state', 'city']
    const requiredFieldsIsFilled = requiredFields.every(field => post[field] !== null)

    switch (currentPage) {
      case 'info':
        status.valid = !isNew
        status.message = I18n.t('post.nav.info.note')
        break
      case 'images':
        ;(status.valid = images.length > 0),
          (status.message = images.length
            ? I18n.t('post.image_has_uploaded')
            : I18n.t('post.please_upload_image'))
        break
      case 'address':
        status.valid = requiredFieldsIsFilled
        status.message = requiredFieldsIsFilled
          ? I18n.t('post.address_has_entered')
          : I18n.t('post.please_input_address')
        break
    }

    return status
  }

  const renderNavItem = item => {
    return (
      <li
        key={item.type}
        className={`
          relative flex justify-between items-center px-5 py-3 text-sm cursor-pointer
          ${page === item.type && 'text-primary'}
        `}
        onClick={() => {
          if (props.isNew) {
            return
          }
          changePage(item.type)
        }}
      >
        <span className="flex items-center">
          <span
            className={`
            flex items-center justify-center w-5 h-5 text-lg
            ${page === item.type ? 'text-primary' : 'text-neutral-600'}
          `}
          >
            <FontAwesomeIcon icon={item.icon} />
          </span>
          <span className="inline-block ml-3 font-bold">
            {I18n.t(`post.nav.${item.type}.label`)}
          </span>
        </span>
        {!getInputStatus(item.type).valid && (
          <span className="text-neutral-600 text-xs">{I18n.t(`post.nav.${item.type}.note`)}</span>
        )}
        {page === item.type && (
          <span className="absolute inset-y-0 right-0 m-auto block w-1 h-8 bg-primary rounded-l-sm" />
        )}
      </li>
    )
  }

  const renderSideNav = () => {
    return (
      <div className="w-64 bg-neutral-200 border-r border-neutral-300">
        <ul className="py-4">{NAV_ITEMS.map(item => renderNavItem(item))}</ul>
        <div className="px-6">
          <span className="inline-block ml-3 font-bold text-sm">
            公開ステータス: {publishState.label}
          </span>
          <Button
            full
            size="small"
            type="button"
            // disabled={
            //   post.published || !getInputStatus('images').valid || !getInputStatus('address').valid
            // }
            // handleClick={publishPost}
            disabled={!getInputStatus('images').valid || !getInputStatus('address').valid}
            handleClick={showStateChangeModal}
          >
            {
              //I18n.t(post.published ? 'generic.published' : 'generic.publish')
            }
            {I18n.t('generic.change_status')}
          </Button>
          {!props.isNew && (
            <Button
              full
              size="small"
              type="button"
              buttonType="secondary"
              className="mt-4"
              link={`/posts/${parsedPost.slug}`}
            >
              {I18n.t('post.view_post')}
            </Button>
          )}
        </div>
      </div>
    )
  }

  const renderMobileFooter = () => {
    return (
      <div
        className={classNames([
          'fixed bottom-0 inset-x-0 bg-white shadow-colored-lg-up',
          'flex justify-between items-center py-2 px-4',
        ])}
      >
        <div className="pr-2">
          <div className={classNames(['relative'])}>
            <span className="absolute inset-y-0 left-0 flex items-center pointer-events-none ml-2">
              <FontAwesomeIcon
                className="absolute left-0 text-lg text-neutral-600"
                icon={NAV_ITEMS.find(nav => nav.type === page)?.icon}
              />
            </span>
            <select
              className={classNames([
                'py-2 px-8 text-sm font-bold border border-neutral-300 rounded-md cursor-pointer',
                'outline-none appearance-none',
              ])}
              value={page}
              onChange={event => {
                if (props.isNew) {
                  return
                }
                changePage(event.target.value)
              }}
              css={css({ width: 'calc(4rem + 4em)' })}
            >
              {NAV_ITEMS.map(nav => (
                <option key={nav.type} value={nav.type}>
                  {I18n.t(`post.nav.${nav.type}.label`)}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none mr-2">
              <FontAwesomeIcon className="text-sm" icon={faChevronDown} />
            </span>
          </div>
        </div>
        <div className="max-w-1/2">
          <span className="inline-block ml-3 font-bold text-sm">
            公開ステータス: {publishState.label}
          </span>
          <Button
            size="small"
            type="button"
            // disabled={
            //   post.published || !getInputStatus('images').valid || !getInputStatus('address').valid
            // }
            // handleClick={publishPost}
            disabled={!getInputStatus('images').valid || !getInputStatus('address').valid}
            handleClick={showStateChangeModal}
          >
            {
              ///I18n.t(post.published ? 'generic.published' : 'generic.publish')
            }
            {I18n.t('generic.change_status')}
          </Button>
        </div>
      </div>
    )
  }

  const showStateChangeModal = () => {
    window.globalModal.showModal({
      title: I18n.t('generic.change_status'),
      body: (
        <StateChangeModal
          post={parsedPost}
          currentStatus={publishState.value}
          setPublishState={setPublishState}
        />
      ),
      showSubmit: false,
    })
  }

  return (
    <React.Fragment>
      <div
        className="flex"
        css={css`
          min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
        `}
      >
        <Desktop>{renderSideNav()}</Desktop>
        <div className="flex-auto p-4 overflow-auto bg-texture">
          {page === 'info' && (
            <Panel
              className={`${page !== 'info' && 'hidden'}`}
              title={I18n.t('post.input_basic_info')}
            >
              <BasicInfo
                post={parsedPost}
                handleFormSubmit={handleFormSubmit}
                categories={categories}
                tags={tags}
                conditions={conditions}
                isNew={isNew}
                setIsNew={setIsNew}
              />
            </Panel>
          )}

          {page === 'address' && (
            <Panel
              className={`${page !== 'address' && 'hidden'}`}
              title={I18n.t('post.input_address')}
            >
              <Address post={parsedPost} handleFormSubmit={handleFormSubmit} />
            </Panel>
          )}

          {page === 'images' && (
            <Panel className={`${page !== 'images' && 'hidden'}`} title={I18n.t('generic.photo')}>
              <Images post={parsedPost} images={initialImages} updateImages={setImages} />
            </Panel>
          )}

          {page === 'calendar' && (
            <React.Fragment>
              <MobileOrTablet>
                <MobilePostCalendar post={post} />
              </MobileOrTablet>
              <Desktop>
                <Calendar className={`${page !== 'calendar' && 'hidden'} h-full`} post={post} />
              </Desktop>
            </React.Fragment>
          )}
        </div>
      </div>
      {!isNew && <MobileOrTablet>{renderMobileFooter()}</MobileOrTablet>}
    </React.Fragment>
  )
}

export default PostNew
