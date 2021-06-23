/** @jsx jsx */
import * as React from 'react'
import { CardElement, Elements, injectStripe, StripeProvider } from 'react-stripe-elements'
import I18n from 'core/i18n'
import { settingsService } from 'core/services'
import { COLORS } from 'constants/colors'
import { getStripePublicKey } from 'utils/stripe'
import { css, jsx } from '@emotion/core'
import classNames from 'classnames'

interface IProps {
  stripe: any
  setStripeParamsGetter: any
}

const createOptions = () => {
  return {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '16px',
        color: COLORS.Text,
        letterSpacing: '0.5px',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: COLORS.Danger,
      },
    },
  }
}

const rootStyle = `
  .StripeElement {
    display: block;
    margin: 10px 0 10px 0;
    max-width: 500px;
    padding: 10px 14px;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border-radius: 4px;
    background: white;
  }

  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    transition: all 150ms ease;
  }

  .StripeElement.PaymentRequestButton {
    padding: 0;
  }
`

const labelStyle = `
  // input {
  //   opacity: 0;
  //   height: 0;
  //   width: 0;
  // }
  //
  // input + span {
  //   &::before,
  //   &::after {
  //     content: '';
  //     position: absolute;
  //     top: 0;
  //     bottom: 0;
  //     left: 0;
  //     margin: auto;
  //     border-radius: 50%;
  //   }
  //
  //   &::before {
  //     width: 18px;
  //     height: 18px;
  //     border: solid 1px ${COLORS.Border};
  //   }
  // }
  //
  // input:checked + span {
  //   &::before {
  //     border: solid 1px ${COLORS.Primary};
  //   }
  //
  //   &::after {
  //     left: 4px;
  //     width: 10px;
  //     height: 10px;
  //     background-color: ${COLORS.Primary};
  //   }
  // }
`

const StripeCardSelect: React.FC<IProps> = props => {
  const [card, setCard] = React.useState(null)
  const [useRegisteredCard, setUseRegisteredCard] = React.useState(true)

  const getCard = async () => {
    const { card: currentCard } = await settingsService.getCard()
    setCard(currentCard)
  }

  React.useEffect(() => {
    getCard()
  }, [])

  const getStripeParams = React.useCallback(async () => {
    if (useRegisteredCard) {
      return { stripe_card_id: card.id }
    } else {
      const createTokenResponse = await props.stripe.createToken()

      if (!createTokenResponse.token) {
        return
      }

      return { stripeToken: createTokenResponse.token.id }
    }
  }, [card, props.stripe, useRegisteredCard])

  React.useEffect(() => {
    props.setStripeParamsGetter(() => getStripeParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStripeParams])

  const renderRadio = (checked, changeValue) => (
    <React.Fragment>
      <input
        className="hidden"
        type="radio"
        name="useRegisteredCard"
        value=""
        checked={checked}
        onChange={() => setUseRegisteredCard(changeValue)}
      />
      <div
        className={classNames([
          'absolute block w-5 h-5 flex items-center justify-center left-0 bottom-0 top-0 m-auto rounded-full border',
          checked ? 'border-primary' : 'border-neutral-300',
        ])}
      >
        <span
          className={classNames([
            'absolute inset-0 m-1 bg-primary rounded-full',
            checked ? 'opacity-100' : 'opacity-0',
          ])}
        />
      </div>
    </React.Fragment>
  )
  return (
    <div css={css(rootStyle)}>
      <div className="mt-3 font-bold">{I18n.t('generic.payment_method')}</div>
      <div className="mt-6 text-sm">
        {card && (
          <label
            className={classNames([
              'mt-4 first:mt-0 pl-8',
              'relative block cursor-pointer',
              'transition duration-150 hover:opacity-75',
            ])}
          >
            {renderRadio(useRegisteredCard, true)}
            <span className="ml-2 first:ml-0">{I18n.t('card.registered_cards')} -</span>
            <span className="ml-2 first:ml-0">{card.brand}</span>
            <span className="ml-2 first:ml-0">{I18n.t('card.card_end')}: </span>
            <span className="ml-2 first:ml-0">{card.last4}</span>
            <span className="ml-6 first:ml-0">{I18n.t('generic.expiration_date')}: </span>
            <span className="ml-2 first:ml-0">
              {card.exp_month}/{card.exp_year}
            </span>
          </label>
        )}
        <label
          className={classNames([
            'mt-4 first:mt-0 pl-8',
            'relative block cursor-pointer',
            'transition duration-150 hover:opacity-75',
          ])}
        >
          {renderRadio(!useRegisteredCard, false)}
          <span className="ml-2 first:ml-0">{I18n.t('card.new_card')}</span>
        </label>
      </div>

      {!useRegisteredCard && (
        <div>
          <CardElement {...createOptions()} />
          <p className="text-sm">{I18n.t('card.note')}</p>
        </div>
      )}
    </div>
  )
}

const StripeInjected = injectStripe(StripeCardSelect)
const StripeCardSelectWithProvider: React.FC<{ setStripeParamsGetter: any }> = props => {
  return (
    <StripeProvider apiKey={getStripePublicKey()}>
      <Elements>
        <StripeInjected setStripeParamsGetter={props.setStripeParamsGetter} />
      </Elements>
    </StripeProvider>
  )
}

export default StripeCardSelectWithProvider
