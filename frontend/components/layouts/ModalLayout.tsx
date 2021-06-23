import * as React from 'react'
import { useEffect } from 'react'
import classNames from 'classnames'
import { IconClose } from 'icon'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from 'hooks/useBodyScrollLock'

export interface IModalLayoutProps {
  isOpen: boolean
  closeModal: () => void
  title?: string
}

const ModalLayout: React.FC<IModalLayoutProps> = props => {
  const { unlockBodyScroll, lockBodyScroll, targetRef } = useBodyScrollLock()
  useEffect(() => {
    if (!targetRef) return

    if (props.isOpen) {
      lockBodyScroll()
    } else {
      unlockBodyScroll()
    }
  }, [lockBodyScroll, props.isOpen, targetRef, unlockBodyScroll])

  const rootClasses = classNames([
    'fixed inset-0 flex items-center justify-center z-60 transition-all',
    props.isOpen ? 'duration-150 opacity-100 visible' : 'opacity-0 invisible',
    // FIXME: 閉じる時に durationを入れるとisOpen = falseと同時にモーダルコンテンツがなくなるとカクつくので暫定的に
  ])

  return createPortal(
    <div className={rootClasses} ref={targetRef}>
      <div className="absolute inset-0 bg-black opacity-40" onClick={props.closeModal} />
      <div className="relative w-full max-w-165 mx-4 p-10 bg-white rounded-md">
        <div
          className="absolute top-0 right-0 mt-6 mr-6 text-3xl text-neutral-600 cursor-pointer"
          onClick={props.closeModal}
        >
          <IconClose />
        </div>
        <div>
          {props.title && <div className="text-xl font-bold mb-5 text-center">{props.title}</div>}
          <div>{props.children}</div>
        </div>
      </div>
    </div>,
    window.document.body
  )
}

export default ModalLayout
