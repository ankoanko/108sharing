import * as React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import uuid from 'uuid'
import FlashMessageItem, {
  FlashMessageType,
} from 'components/organisms/FlashMessage/FlashMessageItem'

interface IWindow {
  flashMessages: FlashMessages
}
declare let window: IWindow

interface IProps {
  messages: IMessage[]
}

interface IState {
  messages: IMessage[]
}

interface IMessage {
  text: string
  type: FlashMessageType
  uuid: string
}

export default class FlashMessages extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = {
      messages: props.messages || [],
    }
    window.flashMessages = this
  }

  public addMessage = (message: Omit<IMessage, 'uuid'>) => {
    const messages = [
      ...this.state.messages,
      {
        ...message,
        uuid: uuid(),
      },
    ]
    this.setState({ messages })
  }

  public deleteMessage = id => {
    const messages = this.state.messages.filter(message => message.uuid !== id)
    this.setState({ messages })
  }

  public render() {
    return (
      <div className="fixed bottom-0 inset-x-0 z-10 mb-6">
        <TransitionGroup>
          {this.state.messages.map((message, index) => (
            <CSSTransition key={message.uuid || uuid()} classNames="fade" timeout={200}>
              <FlashMessageItem
                key={message.uuid}
                uuid={message.uuid}
                type={message.type}
                deleteMessage={this.deleteMessage}
                className={'mb-4 last:mb-0 transition-all duration-150'}
              >
                {message.text}
              </FlashMessageItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    )
  }
}
