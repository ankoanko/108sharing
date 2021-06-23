import * as React from 'react'
import I18n from '../../../../core/i18n'
import { settingsService } from '../../../../core/services'
import { InputText, Toggle } from '../../../atoms'
import FormItem from 'components/layouts/FormItem'
import AdminLayout from 'components/layouts/AdminLayout'
import AdminForm from 'components/pages/admin/AdminForm'
import AdminFormItem from 'components/pages/admin/AdminFormItems'

interface IProps {
  settings: any
}

const FIELDS = {
  default_site: 'default_site',
  default_title: 'default_title',
  default_description: 'default_description',
  default_keywords: 'default_keywords',
  ga_tracking_id: 'ga_tracking_id',
  skip_identification: 'skip_identification',
  skip_profile: 'skip_profile',
}

const title = I18n.t('admin.edit', {
  model: I18n.t('setting', { scope: 'activerecord.models' }),
})

const AdminSettingsEdit: React.FC<IProps> = props => {
  const settings = props.settings.reduce((obj, setting) => {
    obj[setting.var] = setting.value
    return obj
  }, {})
  const [checkedSkipIdentification, setCheckedSkipIdentification] = React.useState(
    settings.skip_identification
  )
  const [checkedSkipProfile, setCheckedSkipProfile] = React.useState(settings.skip_profile)

  const handleSubmit = React.useCallback(async (initialValues, values) => {
    const updatedParams = Object.keys(FIELDS).reduce((acc, cur) => {
      if (initialValues[cur] !== values[cur]) {
        acc[cur] = values[cur]
      }
      return acc
    }, {})

    if (Object.keys(updatedParams).length) {
      await settingsService.updateSetting(updatedParams)
    }

    location.href = '/admin/settings'
  }, [])

  const handleChangeSkipIdentification = React.useCallback(e => {
    setCheckedSkipIdentification(e.target.checked)
  }, [])

  const handleChangeSkipProfile = React.useCallback(e => {
    setCheckedSkipProfile(e.target.checked)
  }, [])

  return (
    <AdminLayout model="setting" title={title}>
      <AdminForm
        fields={FIELDS}
        indexLink="/admin/settings"
        handleSubmit={handleSubmit}
        type="edit"
      >
        <>
          <AdminFormItem>
            <InputText
              name="default_site"
              defaultValue={settings.default_site}
              label={I18n.t('admin.settings.default_site')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              name="default_title"
              defaultValue={settings.default_title}
              label={I18n.t('admin.settings.default_title')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              name="default_description"
              defaultValue={settings.default_description}
              label={I18n.t('admin.settings.default_description')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              name="default_keywords"
              defaultValue={settings.default_keywords}
              label={I18n.t('admin.settings.default_keywords')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <InputText
              name="ga_tracking_id"
              defaultValue={settings.ga_tracking_id}
              label={I18n.t('admin.settings.ga_tracking_id')}
            />
          </AdminFormItem>
          <AdminFormItem>
            <FormItem label={I18n.t('admin.settings.skip_profile')} required={false} error={null}>
              <Toggle
                name="skip_profile"
                checked={checkedSkipProfile}
                onChangeHandler={handleChangeSkipProfile}
              />
            </FormItem>
          </AdminFormItem>
          <AdminFormItem>
            <FormItem
              label={I18n.t('admin.settings.skip_identification')}
              required={false}
              error={null}
            >
              <Toggle
                name="skip_identification"
                checked={checkedSkipIdentification}
                onChangeHandler={handleChangeSkipIdentification}
              />
            </FormItem>
          </AdminFormItem>
        </>
      </AdminForm>
    </AdminLayout>
  )
}

export default AdminSettingsEdit
