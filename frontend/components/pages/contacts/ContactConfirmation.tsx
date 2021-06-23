import * as React from 'react'
import I18n from 'core/i18n'
import { Button } from 'components/atoms'
import { TContactFormFieldValues } from 'hooks/useContact'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
  values: TContactFormFieldValues
  processing: boolean
  handleOnPrev(): void
  handleSubmit(): Promise<void>
}

const ContactConfirmation: React.FC<IProps> = props => {
  return (
    <div>
      <div className="mb-6">{I18n.t('contact.confirmation')}</div>

      <dl>
        {Object.entries(props.values ?? {}).map(([key, value]) => (
          <div key={key} className="mt-8 first:mt-0">
            <dt className="font-bold text-sm">{I18n.t(`contact.${key}`)}</dt>
            <dd className="mt-2">{value}</dd>
          </div>
        ))}
      </dl>

      <div className={'relative flex flex-col items-center mt-12'}>
        <div className={`w-full lg:w-34 lg:absolute lg:left-0 lg:bottom-0`}>
          <Button
            className={`mt-4 first:mt-0`}
            type="button"
            buttonType="muted"
            handleClick={props.handleOnPrev}
            iconLeft={<FontAwesomeIcon className="hidden lg:block" icon={faChevronLeft} />}
          >
            {I18n.t('button.modify')}
          </Button>
        </div>
        <Button
          className="lg:flex-grow mt-4 first:mt-0"
          handleClick={props.handleSubmit}
          disabled={props.processing}
        >
          {I18n.t('button.send')}
        </Button>
      </div>
    </div>
  )
}

export default ContactConfirmation
