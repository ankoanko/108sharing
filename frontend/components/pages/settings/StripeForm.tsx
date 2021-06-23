/** @jsx jsx */
import * as React from 'react'
import { settingsService } from 'core/services'
import I18n from 'core/i18n'
import { ICard, IWindow } from 'core/interfaces'
import { Button, Spinner } from 'components/atoms'
import { CardElement } from 'react-stripe-elements'
import { css, jsx } from '@emotion/core'

declare let window: IWindow

interface IStripeFormProps {
  stripe: any
  isNew: boolean
  setCard(card: ICard): void
  setEdit(edit: boolean): void
  setIsNew?(isNew: boolean): void
}

const createOptions = () => {
  // TODO consider to use tailwind config
  return {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '16px',
        color: '#333',
        letterSpacing: '0.5px',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#FF6666',
      },
    },
  }
}

const stripeElementCss = `
  .StripeElement {
    max-width: 500px;
    padding: 10px 14px;
    box-shadow: rgba(50,50,93,0.14902) 0px 1px 3px, rgba(0,0,0,0.0196078) 0px 1px 0px;
    border-radius: 4px;
  }

  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    transition: all 150ms ease;
  }
  
  .StripeElement.PaymentRequestButton {
    padding: 0;
  }
`

const StripeForm: React.FC<IStripeFormProps> = props => {
  const [isProcessing, setIsProcessing] = React.useState(false)

  const getStripeToken = async () => {
    return await props.stripe.createToken()
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsProcessing(true)
    const { token } = await getStripeToken()

    if (token?.id) {
      const { card, flush } = await settingsService.createCard(token.id)
      if (card) {
        props.setCard(card)
        props.setEdit(false)
        if (props.isNew) {
          props.setIsNew(false)
        }
      }
      setIsProcessing(false)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    } else {
      setIsProcessing(false)
    }
  }

  const renderButtons = () => (
    <div className="flex items-center">
      {props.isNew ? (
        <div className="w-25 ml-4 first:ml-0">
          <Button size="small">{I18n.t('generic.registration')}</Button>
        </div>
      ) : (
        <React.Fragment>
          <div className="w-25 ml-4 first:ml-0">
            <Button
              size="small"
              type="button"
              buttonType="secondary"
              handleClick={() => props.setEdit(false)}
            >
              {I18n.t('generic.cancel')}
            </Button>
          </div>
          <div className="w-25 ml-4 first:ml-0">
            <Button size="small">{I18n.t('generic.change')}</Button>
          </div>
        </React.Fragment>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} css={css(stripeElementCss)}>
      <div>
        <CardElement {...createOptions()} />
        <p className="text-xs mt-5">{I18n.t('card.note')}</p>
        <div className="mt-5">
          {isProcessing ? (
            <div className="flex">
              <Spinner />
            </div>
          ) : (
            renderButtons()
          )}
        </div>
      </div>
    </form>
  )
}

export default StripeForm
