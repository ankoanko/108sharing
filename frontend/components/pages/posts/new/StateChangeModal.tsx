import * as React from 'react'
import I18n from '../../../../core/i18n'
import { IPost, IWindow } from '../../../../core/interfaces'
import { postService } from '../../../../core/services'
import { Button, Select } from '../../../atoms'
import { Form } from '../../../molecules'
import { IState } from './index'
declare let window: IWindow

interface IProps {
  post: IPost
  currentStatus: string
  setPublishState: (IState) => void
  statuses?: IState[]
  setStatuses?(statuses: IState[]): void
}

const StatusModal: React.FC<IProps> = props => {
  const [modalErrors, setModalErrors] = React.useState<{ [key: string]: null | string }>({
    reason: null,
  })
  const [isProcessing, setIsProcessing] = React.useState(false)
  const isDraft = props.currentStatus === 'draft'
  const [isSubmitable, setIsSubmitable] = React.useState(isDraft)
  const initValue = isDraft ? 'published' : props.currentStatus
  const options = [
    {
      label: I18n.t('enums.post.aasm_state.published'),
      value: 'published',
    },
    {
      label: I18n.t('enums.post.aasm_state.closed'),
      value: 'closed',
    },
  ]

  const onChangeHandle = e => {
    const changed =
      options.findIndex(option => option.value === e.target.value) !==
      options.findIndex(option => option.value === props.currentStatus)
    setIsSubmitable(isDraft || changed)
  }

  const handleSubmit = async (initialValues, value) => {
    setIsProcessing(true)
    const { flush, post_path } = await postService.changeStateFromNewState(props.post, value.status)
    window.globalModal.closeModal()
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    location.href = post_path
  }

  return (
    <Form
      fields={{ status: 'status' }}
      handleUpdateForm={updatedErrors => {
        setModalErrors(updatedErrors)
      }}
      handleSubmit={handleSubmit}
    >
      <Select
        required={true}
        name="status"
        options={options}
        label={I18n.t('generic.status')}
        defaultValue={initValue}
        onChangeHandler={onChangeHandle}
      />
      <div className="flex justify-center mt-4">
        <Button type="submit" disabled={isProcessing || !isSubmitable}>
          {I18n.t('generic.update')}
        </Button>
      </div>
    </Form>
  )
}

export default StatusModal
