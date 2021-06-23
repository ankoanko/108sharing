import arrayMove from 'array-move'
import cloneDeep from 'lodash-es/cloneDeep'
import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import I18n from 'core/i18n'
import { postImageService } from 'core/services'
import { DropZoneUploader, Spinner } from 'components/atoms'
import { FlashMessage } from 'components/organisms'
import { isTouchDevice } from 'utils/device'
import { Dispatch, SetStateAction } from 'react'

interface IWindow {
  flashMessages: FlashMessage
  addEventListener: any
  removeEventListener: any
}
declare let window: IWindow

interface IImage {
  description: null | string
  id: number
  url: string
}

interface IProps {
  post: any
  images: IImage[]
  updateImages: Dispatch<SetStateAction<IImage[]>>
}

const useMousePosition = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const setFromEvent = e => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', setFromEvent)

    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  }, [])

  return position
}

const Images: React.FC<IProps> = ({ images: propsImages, post, updateImages }) => {
  const [loading, setLoading] = React.useState(false)
  const [images, setImages] = React.useState(propsImages)
  const position = useMousePosition()

  const deletePostImage = React.useCallback(
    async id => {
      const nextImages = images.filter(image => image.id !== id)
      const { flush } = await postImageService.delete(id)
      setImages(nextImages)
      updateImages(nextImages)
      window.flashMessages.addMessage({ text: flush.message, type: 'success' })
    },
    [images, updateImages]
  )

  const updateImage = React.useCallback(
    async (id, values) => {
      const { flush } = await postImageService.update(id, values)
      window.flashMessages.addMessage({ text: flush.message, type: 'success' })

      const nextImages = images.map(updatedImage =>
        updatedImage.id === id
          ? {
              ...updatedImage,
              ...values,
            }
          : { ...updatedImage }
      )
      setImages(nextImages)
    },
    [images]
  )

  const uploadImage = React.useCallback(
    async image => {
      const fileReader = new FileReader()
      setLoading(true)
      const { postImage, flush } = await postImageService
        .create(post, { file: image })
        .finally(() => setLoading(false))
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })

      fileReader.onloadend = () => {
        const uploadedImage = {
          id: postImage.id,
          url: postImage.image_url,
          description: '',
        }

        setImages(images => [...images, uploadedImage])
        updateImages(images => [...images, uploadedImage])
      }
      fileReader.readAsDataURL(image)
    },
    [post, updateImages]
  )

  const onDrop = React.useCallback(
    async addedImages => {
      let response = null
      for (const image of addedImages) {
        response = await uploadImage(image)
      }

      if (response) {
        window.flashMessages.addMessage({ text: response.data.flush.message, type: 'success' })
      }
    },
    [uploadImage]
  )

  const [hoverIndex, setHoverIndex] = React.useState(null)
  const [dragStartIndex, setDragStartIndex] = React.useState(null)

  const dragstart = React.useCallback((event, index) => {
    setDragStartIndex(index)
    setHoverIndex(index)
  }, [])

  const onDrag = React.useCallback(
    index => {
      if (dragStartIndex === null) {
        return
      }
      setHoverIndex(index)
    },
    [dragStartIndex]
  )

  const dragend = React.useCallback(async () => {
    if (typeof dragStartIndex !== 'number' || typeof hoverIndex !== 'number') {
      return
    }
    const dragImageId = images[dragStartIndex].id
    const dropPosition = hoverIndex + 1
    const nextImages: IImage[] = arrayMove(cloneDeep(images), dragStartIndex, hoverIndex)

    setImages(nextImages)
    setHoverIndex(null)
    setDragStartIndex(null)

    const { flush } = await postImageService.update(dragImageId, { position: dropPosition })
    window.flashMessages.addMessage({ text: flush.message, type: 'success' })
    window.removeEventListener('mouseup', dragend)
  }, [images, dragStartIndex, hoverIndex])

  React.useEffect(() => {
    window.addEventListener('mouseup', dragend)
    return () => window.removeEventListener('mouseup', dragend)
  }, [dragend])

  return (
    <div className={`flex flex-wrap -mx-3 select-none`}>
      <ImageItems
        images={images}
        dragStartIndex={dragStartIndex}
        hoverIndex={hoverIndex}
        dragstart={dragstart}
        onDrag={onDrag}
        deletePostImage={deletePostImage}
        updateImage={updateImage}
      />
      {hoverIndex !== null && (
        <DragItem
          positionX={position.x}
          positionY={position.y}
          dragImage={images[dragStartIndex]}
        />
      )}
      {loading ? (
        <div
          className="
          h-64 mt-6 mx-3 rounded-lg bg-neutral-200
          md:w-1/2
        "
        >
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-56 p-3 md:w-1/2 md:h-auto">
          <DropZoneUploader
            className={`${images.length === 0 ? 'w-full' : ''} h-full`}
            onDrop={onDrop}
          />
        </div>
      )}
    </div>
  )
}

interface IDragItemProps {
  positionX: number
  positionY: number
  dragImage: {
    url: string
  }
}

const DragItem = React.memo<IDragItemProps>(({ positionX, positionY, dragImage }) => (
  <div className="fixed w-48 h-48 opacity-75" style={{ top: positionY, left: positionX }}>
    <img className="w-full h-full object-cover rounded-lg" src={dragImage.url} draggable={false} />
  </div>
))

interface IImageParams {
  description: string
}

interface IImagesProps {
  images: any
  dragStartIndex: number
  hoverIndex: number
  dragstart(event: any, index: number): void
  onDrag(index: number): void
  deletePostImage(id: number): void
  updateImage(id: number, params: IImageParams): void
}

const ImageItems = React.memo<IImagesProps>(
  ({ images, dragStartIndex, hoverIndex, dragstart, onDrag, deletePostImage, updateImage }) => {
    const clonedImages = cloneDeep(images)
    const onDescriptionUpdate = (image, description) => {
      const isEmpty = image.description === null && description === ''
      const isSame = image.description === description
      if (isEmpty || isSame) {
        return
      }
      updateImage(image.id, { description })
    }

    if (hoverIndex !== null) {
      clonedImages.splice(dragStartIndex, 1)
      clonedImages.splice(hoverIndex, 0, null)
    }

    return clonedImages.map((image, index) =>
      image === null ? (
        <div className="p-3 md:w-1/2" key="dropIndicator">
          <div className="h-full border-dashed border-2 border-primary rounded-lg bg-primary bg-opacity-25" />
        </div>
      ) : (
        <div
          className="p-3 md:w-1/2 group cursor-pointer"
          key={index}
          onMouseDown={event => dragstart(event, index)}
          onMouseEnter={() => onDrag(index)}
        >
          <div className="relative h-56 rounded-lg">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={image.url}
              draggable={false}
            />
            <div
              className={`
                ${isTouchDevice() ? 'flex' : 'hidden group-hover:flex'}
                absolute top-0 right-0 items-center justify-center w-8 h-8 -mt-4 -mr-4 rounded-full bg-white border border-neutral-300 shadow cursor-pointer
              `}
              onMouseDown={event => event.stopPropagation()}
              onClick={() => deletePostImage(image.id)}
            >
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="5.64126"
                  y1="4.77295"
                  x2="12.7123"
                  y2="11.844"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12.7124"
                  y1="5.12662"
                  x2="5.64133"
                  y2="12.1977"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <TextareaAutosize
            className="w-full text-sm"
            placeholder={I18n.t('generic.caption')}
            defaultValue={image.description}
            onMouseDown={event => event.stopPropagation()}
            onBlur={(event: any) => onDescriptionUpdate(image, event.target.value)}
          />
        </div>
      )
    )
  }
)

export default Images
