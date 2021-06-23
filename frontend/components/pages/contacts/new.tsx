import * as React from 'react'
import I18n from '../../../core/i18n'
import { userService } from '../../../core/services'
import { Button, InputText, InputTextArea, Panel } from '../../atoms'
import { Form } from '../../molecules'
import { useContact } from 'hooks/useContact'
import ContactConfirmation from 'components/pages/contacts/ContactConfirmation'
import ContactCompleted from 'components/pages/contacts/ContactCompleted'
import { IJsonResponse } from 'core/JsonApiSerializer'

interface IProps {
  user: IJsonResponse
}

const ContactsNew: React.FC<IProps> = props => {
  const { user } = userService.getUserFromJson(props.user)
  const {
    formFields,
    currentPage,
    pageTypes,
    setCurrentPage,
    values,
    setValues,
    handleSubmit,
    processing,
    handleUpdateForm,
    errors,
    isSubmitEnabled,
  } = useContact(user.id)

  if (currentPage === pageTypes.complete) {
    return (
      <div className="pt-6 pb-10 px-4 bg-texture">
        <ContactCompleted />
      </div>
    )
  }

  if (currentPage === pageTypes.confirm) {
    return (
      <div className="pt-6 pb-10 px-4 bg-texture">
        <Panel title={I18n.t('generic.contact')}>
          <ContactConfirmation
            values={values}
            processing={processing}
            handleOnPrev={() => setCurrentPage(pageTypes.new)}
            handleSubmit={handleSubmit}
          />
        </Panel>
      </div>
    )
  }

  return (
    <div className="pt-6 pb-10 px-4 bg-texture">
      <Panel title={I18n.t('generic.contact')}>
        <Form
          fields={formFields}
          handleSubmit={(_, values) => {
            setValues(values as any)
            setCurrentPage(pageTypes.confirm)
          }}
          handleUpdateForm={handleUpdateForm}
        >
          <div>
            <div className="mt-6 first:mt-0">
              <InputText
                name="name"
                label={I18n.t('contact.name')}
                defaultValue={values?.name ?? user.username ?? ''}
                required={true}
                error={errors.name}
              />
            </div>
            <div className="mt-6 first:mt-0">
              <InputText
                name="email"
                label={I18n.t('contact.email')}
                defaultValue={values?.email ?? user.email ?? ''}
                required={true}
                error={errors.email}
              />
            </div>
            <div className="mt-6 first:mt-0">
              <InputText
                name="subject"
                label={I18n.t('contact.subject')}
                defaultValue={values?.subject ?? ''}
                required={true}
                error={errors.subject}
              />
            </div>
            <div className="mt-6 first:mt-0">
              <InputTextArea
                name="body"
                label={I18n.t('contact.body')}
                defaultValue={values?.body ?? ''}
                required={true}
                error={errors.body}
              />
            </div>
            <div className="flex justify-center mt-10">
              <Button disabled={!isSubmitEnabled}>{I18n.t('generic.next')}</Button>
            </div>
          </div>
        </Form>
      </Panel>
    </div>
  )
}

export default ContactsNew
