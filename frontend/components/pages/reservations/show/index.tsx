/** @jsx jsx */
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import { IUser } from 'core/interfaces'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { reservationService } from 'core/services'
import { BREAKPOINT_TABLET_LARGE, HEADER_HEIGHT } from 'constants/constants'
import * as RailsActionCable from 'utils/actionCable'
import UserShowProfile from 'components/pages/users/show/UserShowProfile'
import UserShowTabNav from 'components/pages/users/show/UserShowTabNav'
import MessageForm from './MessageForm'
import Thread from './Thread'
import ReservationDetail from 'components/pages/reservations/show/ReservationDetail'
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import I18n from 'core/i18n'

export interface IMessage {
  body: string
  conversationId: number
  created_at: string
  file_attached: boolean
  file_url: null | string
  formatted_sent_time: string
  id: number
  sender: IUser
  sent_at: string
  updated_at: string
  other?: boolean
}

interface IProps {
  user: IJsonResponse
  other_user: IJsonResponse
  reservation: IJsonResponse
  messages: IJsonResponse
  conversation: any
  receipt_id: number
}

const Show: React.FC<IProps> = props => {
  const { data: user } = reservationService.getDataFromJson(props.user)
  const { data: otherUser } = reservationService.getDataFromJson(props.other_user)
  const { data: parsedMessages } = reservationService.getDataFromJson(props.messages)
  const { data: reservation } = reservationService.getDataFromJson(props.reservation)
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })
  const [messages, setMessages] = React.useState<IMessage[]>([])
  const reservationId = props.conversation.reservation_id
  const foundReservation = props.messages.included.find(
    includedResource =>
      includedResource.type === 'reservations' && includedResource.attributes.id === reservationId
  )
  const parsedReservation = reservationService.parseRelationships(props.messages, foundReservation)
  const addMessage = message => {
    setMessages((currentMessages: IMessage[]) => [{ ...message, other: true }, ...currentMessages])
  }
  const currentUserIsHost = parsedReservation.user.id === otherUser.id

  React.useEffect(() => {
    setMessages([...parsedMessages].reverse())

    RailsActionCable.create(
      { channel: 'ConversationsChannel' },
      {
        received(data) {
          const { data: parsedMessage } = reservationService.getDataFromJson(
            data.serialized_message
          )
          addMessage(parsedMessage)
          LastReadChannel.perform('update', { conversation_id: data.conversation_id })
        },
      }
    )

    const LastReadChannel = RailsActionCable.create({
      channel: 'LastReadChannel',
      conversation_id: props.conversation.id,
    })

    LastReadChannel.perform('update', { conversation_id: props.conversation.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [currentTab, setCurrentTab] = React.useState<'message' | 'reservation'>('message')
  const tabs = [
    {
      label: I18n.t('generic.message'),
      onClick: () => setCurrentTab('message'),
      active: currentTab === 'message',
    },
    {
      label: I18n.t('reservation.reservation_detail'),
      onClick: () => setCurrentTab('reservation'),
      active: currentTab === 'reservation',
    },
  ]

  return (
    <div className="lg:flex lg:bg-neutral-200">
      <div
        className={`lg:w-80 py-6 lg:py-10 px-4 lg:px-6 bg-neutral-200 border-r border-neutral-300`}
      >
        <div
          className="lg:sticky"
          css={css`
            top: ${HEADER_HEIGHT + 40}px;
          `}
        >
          <UserShowProfile user={otherUser} />
        </div>
      </div>
      <div
        className={`
          px-4 py-4
          lg:flex lg:flex-col lg:flex-grow lg:w-0 lg:px-6 lg:py-10 lg:bg-neutral-100
        `}
        css={css(isDesktop ? `min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px)` : '')}
      >
        <div className="w-full max-w-4xl mx-auto">
          <UserShowTabNav tabs={tabs} />
        </div>

        <div
          className={classNames([
            'flex flex-col flex-1 w-full mt-6 max-w-4xl mx-auto',
            'lg:mt-4 lg:rounded-xlg lg:shadow-colored-lg lg:bg-white lg:overflow-hidden',
          ])}
        >
          <div
            className={classNames([
              'flex flex-col flex-1 w-full',
              currentTab !== 'message' && 'hidden',
            ])}
          >
            <div className="flex-1 overflow-y-scroll lg:px-15">
              <div className="h-full lg:py-8">
                <Thread messages={messages} />
              </div>
            </div>

            <div
              className={classNames([
                'fixed bottom-0 inset-x-0 px-4 bg-white shadow-footer',
                'lg:static lg:px-0 lg:py-0',
              ])}
            >
              <MessageForm user={user} conversation={props.conversation} />
            </div>
          </div>

          <div
            className={classNames(['lg:py-10 lg:px-15', currentTab !== 'reservation' && 'hidden'])}
          >
            <ReservationDetail reservation={reservation} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Show
