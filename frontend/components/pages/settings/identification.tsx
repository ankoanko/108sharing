import * as React from 'react'
import I18n from '../../../core/i18n'
import { IWindow } from '../../../core/interfaces'
import { IJsonResponse } from '../../../core/JsonApiSerializer'
import { settingsService, userService } from '../../../core/services'
import { Button, DropZoneUploader, Panel } from '../../atoms'
import SettingsLayout from 'components/layouts/SettingsLayout'
import classNames from 'classnames'

declare let window: IWindow

interface IProps {
  user: any
  identification: IJsonResponse
}

interface IPreviewImage {
  file: any
  url: string
}

const Identification: React.FC<IProps> = props => {
  const { user: initialUser } = userService.getUserFromJson(props.user)
  const { data: identification } = settingsService.getDataFromJson(props.identification)
  const [previewImages, setPreviewImage] = React.useState<IPreviewImage[]>([])
  const [requested, setRequested] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const onDropHandler = addedImages => {
    addedImages.forEach(addedImage => {
      const fileReader = new FileReader()

      fileReader.onloadend = (event: any) => {
        const loadedImage = {
          file: addedImage,
          url: event.target.result,
        }

        setPreviewImage(currentPreviewImages => [...currentPreviewImages, loadedImage])
      }
      fileReader.readAsDataURL(addedImage)
    })
  }

  const submitIdentification = React.useCallback(async () => {
    setSending(true)
    let result
    for (const image of previewImages) {
      result = await settingsService.createIdentificationImage(image.file)
    }
    if (result) {
      setRequested(true)
      const { flush } = result
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    }
    setSending(false)
  }, [previewImages])

  const deletePreviewImage = deleteIndex => {
    setPreviewImage(currentPreviewImages =>
      currentPreviewImages.filter((image, index) => index !== deleteIndex)
    )
  }

  const renderState = (identificationWorkFlowState: 'requested' | 'approved' | 'declined') => {
    return (
      <div
        className={classNames([
          'text-sm',
          identificationWorkFlowState === 'requested' && 'text-blue',
          identificationWorkFlowState === 'approved' &&
            'py-3 px-4 text-green border border-green rounded-md',
          identificationWorkFlowState === 'declined' && 'text-red',
        ])}
      >
        {I18n.t(`enums.identification.workflow_state_message.${identificationWorkFlowState}`)}
      </div>
    )
  }

  const renderUploadField = () => {
    return requested ? (
      <div className="text-sm">{I18n.t('settings.identification_has_sent')}</div>
    ) : (
      <div>
        <div>
          {!!previewImages?.length && (
            <div>
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className={`
                flex flex-col mt-6 first:mt-0 pt-6 first:pt-0 border-t first:border-0 border-neutral-300
                lg:flex-row lg:items-center
              `}
                >
                  <div className="lg:w-1/2">
                    <img src={image.url} className="block w-full" />
                  </div>
                  <div className="lg:w-1/2 mt-6 lg:mt-0 lg:ml-6 flex justify-center">
                    <Button
                      type="button"
                      size="small"
                      buttonType="secondary"
                      handleClick={() => deletePreviewImage(index)}
                    >
                      {I18n.t('generic.delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 first:mt-0">
            <DropZoneUploader onDrop={onDropHandler} />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            handleClick={submitIdentification}
            disabled={previewImages.length === 0 || sending}
          >
            {I18n.t('generic.send')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SettingsLayout
      user={initialUser}
      main={
        <Panel title={I18n.t('settings.identification')}>
          {identification && identification.workflow_state
            ? renderState(identification.workflow_state)
            : renderUploadField()}
        </Panel>
      }
    />
  )
}

export default Identification
