import * as React from 'react'
import { Button, Panel } from 'components/atoms'
import I18n from 'core/i18n'

interface IProps {}

const ContactCompleted: React.FC<IProps> = props => {
  return (
    <Panel>
      <div className="text-center">
        <div className="text-xl text-center font-bold">{I18n.t('contact.completed')}</div>
        <div className="mt-8 whitespace-pre-wrap">{I18n.t('contact.completed_message')}</div>
        <div className="mt-8 flex justify-center">
          <Button link={'/'}>{I18n.t('button.go_to_top')}</Button>
        </div>
      </div>
    </Panel>
  )
}

export default ContactCompleted
