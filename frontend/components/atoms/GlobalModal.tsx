import * as React from 'react'
import Button from './Button'
import ModalLayout from 'components/layouts/ModalLayout'

interface IWindow {
  globalModal: GlobalModal
}
declare let window: IWindow

interface IProps {}

interface IState {
  title: string
  showModal: boolean
  body: React.ReactElement
  closeText: string
  submitText: string
  handleSubmit: () => void
  showSubmit?: boolean
}

interface IOpenModalProps {
  title?: string
  body: React.ReactElement
  closeText?: string
  submitText?: string
  handleSubmit?: () => void
  showSubmit?: boolean
}

const initialState = {
  title: '',
  showModal: false,
  body: null,
  closeText: '',
  submitText: '',
  handleSubmit: () => {},
  showSubmit: true,
}

export default class GlobalModal extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props)

    this.state = { ...initialState }
    window.globalModal = this
  }

  public showModal = (config: IOpenModalProps) => {
    this.setState({
      ...initialState,
      ...config,
      showModal: true,
    })
  }

  public closeModal = () => {
    this.setState({ showModal: false })
  }

  public render() {
    return (
      <ModalLayout
        isOpen={this.state.showModal}
        closeModal={this.closeModal}
        title={this.state.title}
      >
        <>
          {this.state.body}
          {(this.state.closeText || this.state.handleSubmit) && this.state.showSubmit && (
            <div className="flex justify-center mt-6">
              {this.state.closeText && (
                <Button size="small" buttonType="muted" handleClick={this.closeModal}>
                  {this.state.closeText}
                </Button>
              )}
              {this.state.handleSubmit && (
                <Button
                  className="ml-4"
                  size="small"
                  buttonType="primary"
                  handleClick={this.state.handleSubmit}
                >
                  {this.state.submitText}
                </Button>
              )}
            </div>
          )}
        </>
      </ModalLayout>
    )
  }
}
