import * as React from 'react'
import ModalLayout, { IModalLayoutProps } from 'components/layouts/ModalLayout'
import { IReservation, IWindow } from 'core/interfaces'
import I18n from 'core/i18n'
import { Button, InputTextArea, TextLink } from 'components/atoms'
import Form from 'components/molecules/Form'
import { postService } from 'core/services'
import { ReviewStars } from 'components/molecules/index'
declare let window: IWindow

interface IProps extends Omit<IModalLayoutProps, 'title'> {
  reservation: null | IReservation
}

const FIELDS = {
  rating: 'rating',
  body: 'body',
}

const ReviewModal: React.FC<IProps> = ({ reservation, closeModal, isOpen }) => {
  const [score, setScore] = React.useState(5)
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState({ body: null })

  const handleUpdateForm = React.useCallback((updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }, [])

  const handleSubmit = React.useCallback(
    async (initialValues, values) => {
      const params = {
        reservation_id: reservation.id,
        rating: Number(values.rating),
        body: values.body,
      }

      // TODO 親コンポーネントから渡す？
      const { flush } = await postService.createReview(params)
      window.flashMessages.addMessage({
        text: flush.message,
        type: flush.type,
      })
      closeModal()
    },
    [reservation, closeModal]
  )

  React.useEffect(() => {
    if (!isOpen) return

    setScore(5)
    setIsSubmitEnabled(false)
    setErrors({ body: null })
  }, [isOpen])

  return (
    <ModalLayout isOpen={isOpen} title={I18n.t('review.add_review')} closeModal={closeModal}>
      {reservation && (
        <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
          <div className="mt-6 first:mt-0">
            <div className="text-sm font-bold mb-3">{I18n.t('generic.item')}</div>
            <div>
              <TextLink href={`/posts/${reservation.post.slug}`}>{reservation.post.name}</TextLink>
            </div>
          </div>

          <div className="mt-6 first:mt-0">
            <div className="text-sm font-bold mb-3">{I18n.t('review.rating')}</div>
            <div>
              <input required={true} type="hidden" name="rating" value={score} />
              <ReviewStars score={score} setScore={setScore} />
            </div>
          </div>

          <div className="mt-6 first:mt-0">
            <div className="text-sm font-bold mb-3">{I18n.t('review.description')}</div>
            <div>
              <InputTextArea
                required={true}
                name="body"
                placeholder={I18n.t('placeholder.review_body')}
                defaultValue=""
                error={errors.body}
              />
            </div>
          </div>

          <div className="mt-6 first:mt-0 flex justify-center">
            <div className="w-25 ml-4 first:ml-0">
              <Button type="button" buttonType="muted" size="small" handleClick={closeModal}>
                {I18n.t('generic.cancel')}
              </Button>
            </div>
            <div className="w-25 ml-4 first:ml-0">
              <Button
                type="submit"
                buttonType="primary-filled"
                size="small"
                disabled={!isSubmitEnabled}
              >
                {I18n.t('generic.send')}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </ModalLayout>
  )
}

export default ReviewModal
