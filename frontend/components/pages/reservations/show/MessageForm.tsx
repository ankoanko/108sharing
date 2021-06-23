import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import I18n from 'core/i18n'
import { reservationService } from 'core/services'
import * as forms from 'utils/form'
import { Button } from 'components/atoms'
import { Form } from 'components/molecules'
import { IconClose } from 'icon'
import classNames from 'classnames'

interface IProps {
  user: any
  conversation: any
}

const FIELDS_MESSAGE = {
  file: 'file',
  body: 'body',
}

const MessageForm: React.FC<IProps> = ({ user, conversation }) => {
  const messageBodyRef = React.useRef(null)

  const [messageAttachFile, setMessageAttachFile] = React.useState(null)
  const [messageAttachFileUrl, setMessageAttachFileUrl] = React.useState(null)
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(null)
  const [isProcessing, setIsProcessing] = React.useState(null)
  const [errors, setErrors] = React.useState({})

  const handleUpdateMessage = React.useCallback((updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }, [])

  const handleSubmitMessage = React.useCallback(
    async (initialValues, values) => {
      const formData = new FormData()

      Object.keys(FIELDS_MESSAGE).forEach(field => {
        if (field === 'file') {
          if (messageAttachFile) {
            formData.append(`message[${field}]`, messageAttachFile)
          }
        } else {
          formData.append(`message[${field}]`, values[field])
        }
      })
      formData.append('message[sender_id]', user.id)
      formData.append('message[conversation_id]', conversation.id)
      setIsProcessing(true)
      await reservationService.createMessage(formData)

      forms.setNativeValue(messageBodyRef.current, '', false)
      messageBodyRef.current.dispatchEvent(new Event('input', { bubbles: true }))
      setIsProcessing(false)
      // reset message[file]
      setMessageAttachFile(null)
      setMessageAttachFileUrl('')
    },
    [conversation.id, messageAttachFile, user.id]
  )

  const updateMessageFile = file => {
    const fileReader = new FileReader()

    fileReader.onloadend = () => {
      setMessageAttachFile(file)
      setMessageAttachFileUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }

  const renderAttachFile = () => (
    <div className="text-center mt-6">
      <div className="relative inline-block align-bottom">
        <img className="max-w-full max-h-30 lg:max-h-40" src={messageAttachFileUrl} alt="" />
        <div
          onClick={() => {
            setMessageAttachFile(null)
            setMessageAttachFileUrl('')
          }}
          className="absolute right-0 top-0 p-2 bg-neutral-300 rounded-full text-neutral-600 cursor-pointer transform -translate-y-1/2 translate-x-1/2"
        >
          <IconClose width="12" height="12" />
        </div>
      </div>
    </div>
  )

  // TODO SPではデザインではfixedになっていた（画像どうするか検討）
  return (
    <div className="relative py-2">
      <div className="max-w-screen-md mx-auto">
        <Form
          fields={FIELDS_MESSAGE}
          handleSubmit={handleSubmitMessage}
          handleUpdateForm={handleUpdateMessage}
        >
          <div
            className={classNames(['flex -mx-2', messageAttachFile ? 'items-end' : 'items-center'])}
          >
            <div className="flex-1 px-2 flex flex-col justify-center">
              <TextareaAutosize
                className="w-full text-sm outline-none"
                placeholder={I18n.t('reservation.input_message')}
                name="body"
                required={true}
                ref={messageBodyRef}
              />
              {messageAttachFileUrl && renderAttachFile()}
            </div>
            <div className="flex items-center lg:items-end px-2 -mx-2">
              <label className="px-2 cursor-pointer">
                <input
                  className="hidden"
                  name="file"
                  type="file"
                  accept="image/png, image/jpeg"
                  key={new Date().toString()}
                  onChange={event => updateMessageFile(event.currentTarget.files[0])}
                />
                <FontAwesomeIcon className="text-lg text-neutral-600" icon={faImage} />
              </label>
              <div className="mx-2 w-25">
                <Button type="submit" size="small" disabled={!isSubmitEnabled || isProcessing}>
                  {I18n.t('generic.send')}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default MessageForm
