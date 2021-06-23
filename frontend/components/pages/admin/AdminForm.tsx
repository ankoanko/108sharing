import { Button } from 'components/atoms'
import I18n from 'core/i18n'
import { Form } from 'components/molecules'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'

interface IProps {
  fields: any
  indexLink: string
  handleSubmit(initialValues, values): void
  type: 'edit' | 'new'
}

const AdminForm: React.FC<IProps> = props => {
  return (
    <Form fields={props.fields} handleSubmit={props.handleSubmit}>
      <div>{props.children}</div>
      <div className={`relative flex flex-col items-center mt-12`}>
        <div className={`w-full lg:w-34 lg:absolute lg:left-0 lg:bottom-0`}>
          <Button
            className={`mt-4 first:mt-0`}
            buttonType="muted"
            link={props.indexLink}
            iconLeft={<FontAwesomeIcon className="hidden lg:block" icon={faChevronLeft} />}
          >
            {I18n.t('generic.back_to_index')}
          </Button>
        </div>
        <Button className="lg:flex-grow mt-4 first:mt-0" disabled={false}>
          {I18n.t(props.type === 'new' ? 'generic.create' : 'generic.update')}
        </Button>
      </div>
    </Form>
  )
}

export default AdminForm
