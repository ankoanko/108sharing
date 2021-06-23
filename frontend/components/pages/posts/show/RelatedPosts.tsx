import once from 'lodash-es/once'
import * as React from 'react'
import { Waypoint } from 'react-waypoint'
import I18n from 'core/i18n'
import { IPost } from 'core/interfaces'
import { postService } from 'core/services'
import { PostItem, Spinner } from 'components/atoms'

interface IProps {
  post: IPost
}

const RelatedPosts: React.FC<IProps> = ({ post }) => {
  const [relatedPosts, setRelatedPosts] = React.useState(null)
  const getRelatedPosts = async () => {
    const { relatedPosts: loaded } = await postService.getRelatedPosts(post)
    setRelatedPosts(loaded)
  }

  return (
    <Waypoint onEnter={once(getRelatedPosts)}>
      <div className="mx-auto overflow-hidden">
        <h3 className="text-xl font-bold mb-4 lg:mb-6">{I18n.t('post.related_posts')}</h3>

        {relatedPosts === null ? (
          <div className="my-8">
            <Spinner />
          </div>
        ) : relatedPosts.length > 0 ? (
          <div className="-m-3 md:flex md:flex-wrap">
            {relatedPosts.map(relatedPost => (
              <div className="p-3 md:w-1/2 lg:w-1/4" key={relatedPost.id}>
                <PostItem post={relatedPost} toggleLike={null} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Waypoint>
  )
}

export default RelatedPosts
