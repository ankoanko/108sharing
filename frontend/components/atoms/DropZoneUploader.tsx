import * as React from 'react'
import { DropEvent, useDropzone } from 'react-dropzone'
import I18n from 'core/i18n'
import { UPLOAD_FILE_MAX_SIZE } from 'constants/constants'
import classNames from 'classnames'

interface IProps {
  className?: string
  onDrop(acceptedFiles, rejectedFiles, event: DropEvent): Promise<void> | void
}

const DropZoneUploader = React.memo<IProps>(({ className = '', onDrop }) => {
  const {
    isDragActive,
    getRootProps,
    getInputProps,
    isDragReject,
    rejectedFiles,
    rootRef,
  } = useDropzone({
    accept: 'image/*',
    maxSize: UPLOAD_FILE_MAX_SIZE,
    minSize: 0,
    onDrop: async (acceptedFiles, rejectedFiles, event) => {
      await onDrop(acceptedFiles, rejectedFiles, event)
      if (rootRef?.current?.blur) rootRef?.current?.blur()
    },
  })
  const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > UPLOAD_FILE_MAX_SIZE
  const active = isDragActive && !isDragReject
  const rejected = isDragReject || isFileTooLarge

  return (
    <div
      {...getRootProps()}
      className={classNames([
        'flex items-center justify-center p-2 border-dashed border-2 rounded-lg text-sm font-bold cursor-pointer text-center',
        'transition duration-150 focus:border-primary focus:outline-none',
        'file-drop-input',
        !active && !rejected && 'border-neutral-300 text-neutral-600',
        active && 'border-primary text-primary',
        rejected && 'border-red text-red',
        className,
      ])}
    >
      <input {...getInputProps()} />
      <p className="file-drop-input-text">
        {!isDragActive && I18n.t('dropzone.select_or_drag_and_drop')}
        {isDragActive && !isDragReject && I18n.t('dropzone.drop')}
        {isDragReject && I18n.t('dropzone.invalid_file')}
        {isFileTooLarge && I18n.t('dropzone.too_large')}
      </p>
    </div>
  )
})

export default DropZoneUploader
