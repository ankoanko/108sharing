import * as React from 'react'
import Slider from 'react-slick'
import { IPostImage } from 'core/interfaces'

interface IPostGalleryProps {
  postImages: IPostImage[]
}

const PostGallery: React.FC<IPostGalleryProps> = props => {
  const [currentImage, setCurrentImage] = React.useState(0)
  const main = React.useRef(null)
  const nav = React.useRef(null)
  const mainSettings = {
    arrows: false,
    dots: false,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentImage(newIndex)
      nav.current.slickGoTo(newIndex)
    },
  }
  const subSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    centerMode: true,
    focusOnSelect: true,
    slidesToShow: props.postImages.length,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentImage(newIndex)
      main.current.slickGoTo(newIndex)
    },
  }

  return (
    <div className="mb-6">
      <div>
        <Slider {...mainSettings} ref={main}>
          {props.postImages.map(image => (
            <div
              className="
              relative w-full h-64 align-top overflow-hidden
              md:h-120 md:rounded-xlg"
              key={image.id}
            >
              <img className="w-full h-full object-cover" src={image.image_url} alt="" />
              {image.description && (
                <p className="absolute inset-x-0 bottom-0 py-2 px-3 bg-black bg-opacity-50 text-white">
                  {image.description}
                </p>
              )}
            </div>
          ))}
        </Slider>
      </div>
      <div className="mt-3 md:mt-4">
        <Slider {...subSettings} ref={nav}>
          {props.postImages.map((image, index) => (
            <div className={`h-16 px-1 outline-none align-top md:h-24 md:px-6px`} key={image.id}>
              <div
                className={`
                relative h-full rounded overflow-hidden opacity-75
                ${index === currentImage && 'border-2 border-primary opacity-100'}`}
              >
                <img className="w-full h-full object-cover" src={image.image_url} alt="" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default PostGallery
