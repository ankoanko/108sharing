import * as React from 'react'
import { userService } from 'core/services'

const ContactFormFields = {
  name: 'name',
  email: 'email',
  subject: 'subject',
  body: 'body',
} as const
export type TContactFormFieldValues = Record<keyof typeof ContactFormFields, any>

const ContactPageTypes = {
  new: 'new',
  confirm: 'confirm',
  complete: 'complete',
} as const

export const useContact = (userId: number) => {
  const [currentPage, setCurrentPage] = React.useState<
    typeof ContactPageTypes[keyof typeof ContactPageTypes]
  >(ContactPageTypes.new)
  const [values, setValues] = React.useState<TContactFormFieldValues | null>(null)
  const [processing, setProcessing] = React.useState(null)
  const [errors, setErrors] = React.useState<any>({})
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)

  const handleUpdateForm = (updatedErrors, isSubmitEnabled) => {
    setIsSubmitEnabled(isSubmitEnabled)
    setErrors(updatedErrors)
  }

  const handleSubmit = React.useCallback(async () => {
    const params = {
      ...values,
      user_id: userId,
    }
    setProcessing(true)
    await userService.createContact(params)
    setCurrentPage(ContactPageTypes.complete)
  }, [userId, values])

  return {
    formFields: ContactFormFields,
    currentPage,
    pageTypes: ContactPageTypes,
    setCurrentPage,
    values,
    setValues,
    handleSubmit,
    processing,
    handleUpdateForm,
    errors,
    isSubmitEnabled,
  }
}
