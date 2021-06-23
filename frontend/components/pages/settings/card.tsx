import * as React from 'react'
import { Elements, injectStripe, StripeProvider } from 'react-stripe-elements'
import I18n from 'core/i18n'
import { userService } from 'core/services'
import { getStripePublicKey } from 'utils/stripe'
import { Button, Panel } from 'components/atoms'
import SettingsLayout from 'components/layouts/SettingsLayout'
import StripeForm from 'components/pages/settings/StripeForm'

interface ICard {
  brand: string
  exp_month: number
  exp_year: number
  id: number
  last4: string
}

interface IProps {
  user: any
  card?: ICard
  isNew: boolean
}

const StripeInjectedForm = injectStripe(StripeForm)

const Card: React.FC<IProps> = props => {
  const { user: initialUser } = userService.getUserFromJson(props.user)
  const [card, setCard] = React.useState<ICard>({ ...props.card })
  const [edit, setEdit] = React.useState(false)
  const [isNew, setIsNew] = React.useState(props.isNew)

  const renderRegisterCard = () => {
    return (
      <>
        <h3>{I18n.t('card.register_card')}</h3>
        <StripeProvider apiKey={getStripePublicKey()}>
          <Elements>
            <StripeInjectedForm
              isNew={isNew}
              setCard={setCard}
              setEdit={setEdit}
              setIsNew={setIsNew}
            />
          </Elements>
        </StripeProvider>
      </>
    )
  }

  const renderEditCard = () => {
    return (
      <>
        <h3>{I18n.t('card.registered_cards')}</h3>
        <div className="mt-6">
          {edit ? (
            <StripeProvider apiKey={getStripePublicKey()}>
              <Elements>
                <StripeInjectedForm setCard={setCard} setEdit={setEdit} />
              </Elements>
            </StripeProvider>
          ) : (
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex items-center">
                  <div>
                    {card.brand}
                    {I18n.t('card.card_end')}:
                  </div>
                  <div className="ml-2">{card.last4}</div>
                </div>
                <div className="flex items-center mt-2 lg:mt-0 lg:ml-4 ">
                  <div className="exp">{I18n.t('generic.expiration_date')}: </div>
                  <div className="ml-2">
                    {card.exp_month}/{card.exp_year}
                  </div>
                </div>
              </div>
              <div className="mt-5 w-18">
                <Button
                  size="small"
                  type="button"
                  buttonType="secondary"
                  handleClick={() => setEdit(true)}
                >
                  {I18n.t('generic.change')}
                </Button>
                {/* <Button>{I18n.t('card.delete_card')}</Button> */}
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <SettingsLayout
      user={initialUser}
      main={
        <Panel title={I18n.t('generic.card')}>
          {isNew ? renderRegisterCard() : renderEditCard()}
        </Panel>
      }
    />
  )
}

export default Card
