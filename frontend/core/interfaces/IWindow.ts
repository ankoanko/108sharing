import GlobalModal from '../../components/atoms/GlobalModal'
import { FlashMessage } from '../../components/organisms'

export default interface IWindow extends Window {
  google: any
  globalModal: GlobalModal
  flashMessages: FlashMessage
}
