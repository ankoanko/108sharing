import { IMessage, IUser } from '.'

export default interface IConversation {
  id: number
  messages: IMessage[]
  other_user: IUser
}
