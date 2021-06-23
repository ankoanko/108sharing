import * as React from 'react'
import I18n from 'core/i18n'
import { postService } from 'core/services'
import { IPost, IReview, IWindow } from 'core/interfaces'
import { AvatarForReview, Button, InputTextArea } from 'components/atoms'
import { Form } from 'components/molecules'

declare let window: IWindow

const REVIEW_REPLY_FIELDS = {
  body: 'body',
}

interface IProps {
  review: IReview
  post: IPost
  updateReviews(review: IReview): void
}

const ReviewReply: React.FC<IProps> = props => {
  const [edit, setEdit] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const handleSubmit = async (initialValues, values) => {
    const { review_reply, flush } = await postService.createReviewReply({
      review_id: props.review.id,
      body: values.body,
    })

    props.updateReviews({
      ...props.review,
      review_reply,
    })
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  React.useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.focus()
    }
  }, [edit])

  return (
    <div className="mt-6">
      {edit ? (
        <div className="ml-12">
          <AvatarForReview user={props.post.user} isReply={false} />
          <div className="mt-3">
            <Form fields={REVIEW_REPLY_FIELDS} handleSubmit={handleSubmit}>
              <InputTextArea
                name="body"
                placeholder={I18n.t('generic.enter_reply')}
                defaultValue={''}
                ref={textareaRef}
              />
              <div className="flex justify-end -mx-2 mt-3">
                <div className="px-2 w-auto">
                  <Button size="small" buttonType="primary">
                    {I18n.t('generic.post')}
                  </Button>
                </div>
                <div className="px-2 w-auto">
                  <Button size="small" buttonType="secondary" handleClick={() => setEdit(false)}>
                    {I18n.t('generic.cancel')}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      ) : (
        <Button handleClick={() => setEdit(true)}>{I18n.t('generic.reply')}</Button>
      )}
    </div>
  )
}

export default ReviewReply
