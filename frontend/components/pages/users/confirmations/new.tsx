import React from 'react'
import I18n from '../../../../core/i18n'
import { userService } from '../../../../core/services'
import { Button, InputText } from '../../../atoms'
import { Form } from '../../../molecules'
import UserLoginLayout from 'components/layouts/UserLoginLayout'
import TextLink from 'components/atoms/TextLink'
import { IconMail } from 'icon'

const FIELDS = {
  email: 'email',
}

interface IState {
  email: string
  errors: any
}

interface IProps {}

class UserConfirmationsNew extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      errors: {},
    }
  }

  public handleUpdateForm = (errors, hasNoError) => {
    this.setState({
      errors: {
        ...this.state.errors,
        ...errors,
      },
    })
  }

  public handleSubmit = async (initialValues, values) => {
    const { redirectUrl } = await userService.createConfirmation({ user: values })
    location.href = redirectUrl
  }

  public render() {
    return (
      <UserLoginLayout>
        <Form
          fields={FIELDS}
          handleSubmit={this.handleSubmit}
          handleUpdateForm={this.handleUpdateForm}
        >
          <div className="mt-4 first:mt-0">
            <InputText
              required={true}
              name="email"
              defaultValue=""
              label={I18n.t('generic.email')}
              placeholder={I18n.t('generic.email')}
              error={this.state.errors.email}
              icon={<IconMail />}
            />
          </div>
          <div className="flex flex-col items-center mt-6">
            {this.state.errors.login && (
              <div className="my-4 text-sm text-red">{this.state.errors.login}</div>
            )}
            <Button>{I18n.t('generic.send')}</Button>
            <div className="mt-2">
              <TextLink href="/users/sign_up">{I18n.t('generic.create_new_account')}</TextLink>
            </div>
          </div>
        </Form>
      </UserLoginLayout>
    )
  }
}

export default UserConfirmationsNew
