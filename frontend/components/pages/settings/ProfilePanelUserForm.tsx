import * as React from 'react'
import { Form } from 'components/molecules'
import { Button, InputText, InputTextArea, Panel } from 'components/atoms'
import I18n from 'core/i18n'
import { userService } from 'core/services'
import ModalLayout from 'components/layouts/ModalLayout'
import CropperUploader from 'components/organisms/CropperUploader'
import { IUser, IWindow } from 'core/interfaces'

declare let window: IWindow

interface IProps {
  user: IUser
  setUser: (user: IUser) => void
  profileRequired: boolean
}

const FIELDS = {
  username: 'username',
  bio: 'bio',
}

const ProfilePanelUserForm: React.FC<IProps> = props => {
  const [showModal, setShowModal] = React.useState(false)
  const [cropping, setCropping] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState(null)

  const handleSubmit = async (initialValues, values) => {
    const formData = new FormData()

    Object.keys(values).forEach(key => {
      if (initialValues[key] !== values[key]) {
        formData.append(`user[${key}]`, values[key])
      }
    })

    if (previewImage) {
      formData.append('user[avatar]', previewImage.file)
    }

    const { updatedUser, flush } = await userService.updateProfile(formData)

    props.setUser(updatedUser)
    window.flashMessages.addMessage({ text: flush.message, type: flush.type })
  }

  const setCroppedImage = croppedCanvas => {
    croppedCanvas.toBlob(blob => {
      setCropping(false)
      setPreviewImage({
        file: blob,
        url: croppedCanvas.toDataURL(),
      })
    }, 'image/*')
  }

  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState<any>({})

  const handleUpdateForm = (updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }

  const cancelModal = () => {
    setPreviewImage(null)
    setShowModal(false)
  }
  return (
    <Panel title={I18n.t('generic.profile')}>
      <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
        <img
          className="block w-28 h-28 object-cover mx-auto rounded-full"
          src={previewImage ? previewImage.url : props.user.avatar_url}
        />
        <div className="flex items-center justify-center w-28 mx-auto mt-4">
          <Button
            type="button"
            handleClick={() => setShowModal(true)}
            buttonType="secondary"
            size="small"
          >
            {I18n.t('generic.select_image')}
          </Button>
        </div>
        <div className="mt-8">
          <InputText
            required={true}
            name="username"
            label={I18n.t('generic.name')}
            defaultValue={props.user.username}
            error={errors.username}
          />
        </div>
        <div className="mt-6">
          <InputTextArea
            required={props.profileRequired}
            name="bio"
            label={I18n.t('generic.bio')}
            defaultValue={props.user.bio}
            error={errors.bio}
          />
        </div>
        <div className="flex items-center justify-center mt-6">
          <Button disabled={!isSubmitEnabled} buttonType="primary">
            {I18n.t('generic.save')}
          </Button>
        </div>
      </Form>

      {/* TODO extract modal as component*/}
      <ModalLayout
        isOpen={showModal}
        closeModal={cancelModal}
        title={I18n.t('settings.avatar_image')}
      >
        <>
          <div>
            {cropping ? (
              <CropperUploader
                imageFile={previewImage.url}
                setCroppedImage={setCroppedImage}
                cancelCrop={() => setCropping(false)}
              />
            ) : (
              <>
                <img
                  className="block w-50 h-50 object-cover rounded-full mx-auto"
                  src={previewImage ? previewImage.url : props.user.avatar_url}
                />
                <div className="mt-3 flex justify-center">
                  <label
                    className="py-1 px-2 text-xs border border-neutral-300 rounded-sm cursor-pointer "
                    htmlFor="avatorFile"
                  >
                    {I18n.t('generic.select_file')}
                    <input
                      id="avatorFile"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={event => {
                        setPreviewImage({
                          file: event.currentTarget.files[0],
                          url: URL.createObjectURL(event.currentTarget.files[0]),
                        })
                      }}
                    />
                  </label>
                </div>
                <div className={`flex justify-center ${previewImage ? 'mt-3' : ''}`}>
                  {previewImage && (
                    <div className="ml-4 first:ml-0">
                      <button
                        type="button"
                        onClick={() => setCropping(true)}
                        className="text-xs text-primary underline focus:outline-none"
                      >
                        {I18n.t('generic.trimming')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center mt-6 px-4">
            <div className="w-25 ml-4 first:ml-0">
              <Button type="button" buttonType="muted" size="small" handleClick={cancelModal}>
                {I18n.t('generic.cancel')}
              </Button>
            </div>
            <div className="w-25 ml-4">
              <Button
                type="button"
                buttonType="primary-filled"
                size="small"
                handleClick={() => setShowModal(false)}
              >
                {I18n.t('generic.ok')}
              </Button>
            </div>
          </div>
        </>
      </ModalLayout>
    </Panel>
  )
}

export default ProfilePanelUserForm
