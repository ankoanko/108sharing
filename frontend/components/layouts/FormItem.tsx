import * as React from 'react'

interface IProps {
  label: string
  required: boolean
  error: null | string
}

const FormItem: React.FC<IProps> = ({ label, required, error, children }) => {
  return (
    <div>
      {label && (
        <p className="text-sm">
          {label}
          {required && <span className="inline-block ml-1 text-red font-bold">*</span>}
        </p>
      )}
      <div className="mt-2">
        {children}
        {error && <span className="block mt-2 text-red text-sm">{error}</span>}
      </div>
    </div>
  )
}

export default FormItem
