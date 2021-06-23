import * as React from 'react'
import I18n from 'core/i18n'
import { userService, settingsService } from 'core/services'
import { Button, Panel, InputText, Select } from 'components/atoms'
import { Form } from 'components/molecules'
import { IWindow, IUser } from 'core/interfaces'

import SettingsLayout from 'components/layouts/SettingsLayout'
import { IJsonResponse } from 'core/JsonApiSerializer'

declare let window: IWindow

interface IBank {
  bank_name: string
  branch_name: string
  number: string
  account_type: string
  name: string
  bank_code: string
  branch_code: string
  id: string
}

const FIELDS = {
  bank_name: 'bank_name',
  branch_name: 'branch_name',
  number: 'number',
  account_type: 'account_type',
  name: 'name',
  bank_code: 'bank_code',
  branch_code: 'branch_code',
}

interface IProps {
  user: IJsonResponse
  bank_account?: IBank
  setBank: (bank_account: IBank) => void
}

const BankAccount: React.FC<IProps> = props => {
  const { user: initialUser } = userService.getUserFromJson(props.user)
  const { data: initialBankAccount } = settingsService.getDataFromJson(props.bank_account)
  const [user, setUser] = React.useState<IUser>(initialUser)
  const [bank_account, setBankAccount] = React.useState<IBank>(initialBankAccount || {})

  const handleSubmit = async (initialValues, values) => {
    const formData = new FormData()
    Object.keys(values).forEach(key => {
      formData.append(`bank_account[${key}]`, values[key])
    })

    if (bank_account.id) {
      formData.append(`bank_account[id]`, bank_account.id)
      const { updatedBankAccount, flush } = await settingsService.updateBankAccount(
        bank_account.id,
        formData
      )
      setBankAccount(updatedBankAccount)
      window.flashMessages.addMessage({ text: flush.message, type: flush.type })
    } else {
      const { createdBankAccount, flush } = await settingsService.createBankAccount(formData)
      setBankAccount(createdBankAccount)
      window.flashMessages.addMessage({
        text: flush.message,
        type: flush.type,
      })
    }
  }

  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState<any>({})

  const handleUpdateForm = (updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }

  const renderEditBankAccount = () => {
    return (
      <>
        <Form fields={FIELDS} handleSubmit={handleSubmit} handleUpdateForm={handleUpdateForm}>
          <div className="mt-8">
            <InputText
              required={true}
              name="bank_name"
              label={I18n.t('bank_account_info.bank_name')}
              defaultValue={bank_account.bank_name || ''}
              error={errors.bank_name}
              placeholder={I18n.t('bank_account_info.placeholder.bank_name')}
            />
          </div>

          <div className="mt-8">
            <InputText
              required={true}
              name="bank_code"
              label={I18n.t('bank_account_info.bank_code')}
              defaultValue={bank_account.bank_code || ''}
              error={errors.bank_code}
              placeholder={I18n.t('bank_account_info.placeholder.bank_code')}
            />
          </div>

          <div className="mt-8">
            <InputText
              required={true}
              name="branch_name"
              label={I18n.t('bank_account_info.branch_name')}
              defaultValue={bank_account.branch_name || ''}
              error={errors.branch_name}
              placeholder={I18n.t('bank_account_info.placeholder.branch_name')}
            />
          </div>

          <div className="mt-8">
            <InputText
              required={true}
              name="branch_code"
              label={I18n.t('bank_account_info.branch_code')}
              defaultValue={bank_account.branch_code || ''}
              error={errors.branch_code}
              placeholder={I18n.t('bank_account_info.placeholder.branch_code')}
            />
          </div>

          <div className="mt-8">
            <InputText
              required={true}
              name="number"
              label={I18n.t('bank_account_info.number')}
              defaultValue={bank_account.number || ''}
              error={errors.number}
              placeholder={I18n.t('bank_account_info.placeholder.number')}
            />
          </div>
          <div className="mt-8">
            <Select
              required={true}
              name="account_type"
              label={I18n.t('bank_account_info.account_type')}
              options={[
                { value: 'saving', label: '普通' },
                { value: 'checking', label: '当座' },
              ]}
              defaultValue={bank_account.account_type || '普通'}
            />
          </div>
          <div className="mt-8">
            <InputText
              required={true}
              name="name"
              label={I18n.t('bank_account_info.name')}
              defaultValue={bank_account.name || ''}
              error={errors.name}
              placeholder={I18n.t('bank_account_info.placeholder.name')}
            />
          </div>
          <div className="flex items-center justify-center mt-6">
            <Button disabled={!isSubmitEnabled} buttonType="primary">
              {I18n.t('generic.save')}
            </Button>
          </div>
        </Form>
      </>
    )
  }

  return (
    <SettingsLayout
      user={user}
      main={<Panel title={I18n.t('generic.bank_account')}>{renderEditBankAccount()}</Panel>}
    />
  )
}

export default BankAccount
