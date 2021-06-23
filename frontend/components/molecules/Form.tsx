import isEqual from 'lodash-es/isEqual'
import * as React from 'react'
import I18n from 'core/i18n'
import { MAX_TEXT_COUNT, MAX_TEXTAREA_COUNT } from 'constants/constants'

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | RadioNodeList
type SingleFormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface IFormValues {
  [key: string]: string | number | boolean | null | number[] | string[]
}

interface IErrors {
  [key: string]: string | null
}

export interface IImperativeMethods {
  handleFormSubmit(event?: React.FormEvent<HTMLFormElement>): void
}

interface IProps extends React.HTMLProps<HTMLFormElement> {
  fields: { [key: string]: string }
  handleSubmit?(initialValues: IFormValues, submitValues: IFormValues): void
  handleUpdateForm?(errors: IErrors, submitEnabled: boolean, values?: IFormValues): void
  customValidation?(field: string, value: any): string | null
}

const Form = React.forwardRef<IImperativeMethods, IProps>(
  ({ fields = {}, handleSubmit, handleUpdateForm, customValidation, children }, ref) => {
    const formRef = React.useRef<HTMLFormElement>()
    const initialValues = React.useRef<IFormValues>()
    const [errors, setErrors] = React.useState<IErrors>({})

    const validateSingleField = React.useCallback(field => {
      if (field.required && field.value === '') {
        return I18n.t('common_errors.empty')
      }
      if (field.type === 'text' && field.value.length > MAX_TEXT_COUNT) {
        return `${MAX_TEXT_COUNT}${I18n.t('common_errors.too_long')}`
      }
      if (field.type === 'textarea' && field.value.length > MAX_TEXTAREA_COUNT) {
        return `${MAX_TEXTAREA_COUNT}${I18n.t('common_errors.too_long')}`
      }
      return null
    }, [])

    const getFormElement = React.useCallback((name: string): null | FormElement => {
      if (!formRef.current) {
        return null
      } else {
        return formRef.current.elements[name]
      }
    }, [])

    const validateAllFields = React.useCallback(() => {
      const currentErrors: IErrors = {}
      Object.keys(fields).forEach(key => {
        const validatedError = validateSingleField(getFormElement(key))
        if (validatedError !== null) {
          currentErrors[key] = validatedError
        }
      })
      if (typeof customValidation === 'function') {
        Object.keys(fields).forEach(key => {
          const customValidatedError = customValidation(key, getFormElement(key)?.value)
          if (customValidatedError !== null) {
            currentErrors[key] = customValidatedError
          }
        })
      }
      return currentErrors
    }, [customValidation, fields, getFormElement, validateSingleField])

    const getAllFieldsValues = React.useCallback(() => {
      const values: IFormValues = {}
      Object.keys(fields).forEach(key => {
        const formElement = getFormElement(key)
        if (formElement[0]?.type === 'checkbox') {
          // Multiple CheckBox
          const checkBoxValues = []
          ;(formElement as RadioNodeList).forEach(checkBox => {
            const node = checkBox as HTMLInputElement
            if (node.checked) {
              checkBoxValues.push(node.value)
            }
          })
          values[key] = checkBoxValues
        } else if ((formElement as SingleFormElement)?.type === 'checkbox') {
          // Boolean CheckBox
          const element = formElement as HTMLInputElement
          values[key] = element.checked
        } else {
          values[key] = formElement.value
        }
      })
      return values
    }, [fields, getFormElement])

    const isValid = React.useMemo(() => Object.keys(errors).length === 0, [errors])

    const getRequiredFieldsIsFilled = React.useCallback(() => {
      return Object.keys(fields).every((key: string) => {
        const field: any = getFormElement(key)

        if (!field) {
          return false
        } else {
          return !field.required || (field.required && field.value !== '')
        }
      })
    }, [fields, getFormElement])

    const handleFormChange = React.useCallback(() => {
      if (!formRef.current) {
        return
      }

      if (typeof handleUpdateForm === 'function') {
        handleUpdateForm(errors, getRequiredFieldsIsFilled() && isValid, getAllFieldsValues())
      }
    }, [errors, getAllFieldsValues, getRequiredFieldsIsFilled, handleUpdateForm, isValid])

    const handleFormBlur = React.useCallback(
      event => {
        if (event.target.type === 'submit') {
          return
        }

        const field = event.target
        const currentErrors = { ...errors }
        if (validateSingleField(field)) {
          currentErrors[field.name] = validateSingleField(field)
        } else {
          delete currentErrors[field.name]
        }
        if (typeof customValidation === 'function') {
          const customValidatedError = customValidation(event.target.name, event.target.value)

          if (customValidatedError !== null) {
            currentErrors[field.name] = customValidatedError
          }
        }

        setErrors({ ...currentErrors })
        handleFormChange()
      },
      [customValidation, errors, handleFormChange, validateSingleField]
    )

    const handleFormSubmit = React.useCallback(
      (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
          event.preventDefault()
        }

        const beforeSubmitErrors = validateAllFields()

        if (!isEqual(beforeSubmitErrors, errors)) {
          setErrors({ ...beforeSubmitErrors })
          if (typeof handleUpdateForm === 'function') {
            handleUpdateForm(beforeSubmitErrors, isValid)
          }
        }
        if (!isValid || Object.keys(beforeSubmitErrors).length !== 0) {
          return
        }
        handleSubmit(initialValues.current, getAllFieldsValues())
      },
      [validateAllFields, errors, isValid, handleSubmit, getAllFieldsValues, handleUpdateForm]
    )
    // 呼び出し元コンポーネントからsubmitできるように
    React.useImperativeHandle(ref, () => ({
      handleFormSubmit,
    }))

    React.useEffect(() => {
      initialValues.current = getAllFieldsValues()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
      handleFormChange()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors])

    return (
      <form
        className="Form"
        onChange={handleFormChange}
        onBlur={handleFormBlur}
        onSubmit={handleFormSubmit}
        ref={formRef}
      >
        {children}
      </form>
    )
  }
)

export default Form
