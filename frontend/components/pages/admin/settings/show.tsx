import * as React from 'react'
import I18n from '../../../../core/i18n'
import { Button } from '../../../atoms'
import AdminLayout from 'components/layouts/AdminLayout'

interface IProps {
  settings: any
}

const AdminSettingsShow: React.FC<IProps> = props => {
  const boolToLabel = bool => (bool ? I18n.t('generic.label_yes') : I18n.t('generic.label_no'))
  const settings = props.settings.reduce((obj, setting) => {
    obj[setting.var] =
      typeof setting.value === 'boolean' ? boolToLabel(setting.value) : setting.value
    return obj
  }, {})

  const items = [
    {
      title: (
        <>
          {I18n.t('admin.settings.default_site')}
          <br />
          <small>{I18n.t('admin.settings.default_site_caption')}</small>
        </>
      ),
      valueKey: 'default_site',
    },
    { title: I18n.t('admin.settings.default_title'), valueKey: 'default_title' },
    { title: I18n.t('admin.settings.default_description'), valueKey: 'default_description' },
    { title: I18n.t('admin.settings.default_keywords'), valueKey: 'default_keywords' },
    { title: I18n.t('admin.settings.ga_tracking_id'), valueKey: 'ga_tracking_id' },
    { title: I18n.t('admin.settings.skip_profile'), valueKey: 'skip_profile' },
    { title: I18n.t('admin.settings.skip_identification'), valueKey: 'skip_identification' },
  ]

  return (
    <AdminLayout model="setting" title={I18n.t('activerecord.models.setting')}>
      <dl className="flex flex-wrap">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <dt className="w-1/2 mt-6 font-bold">{item.title}</dt>
            <dd className="w-1/2 mt-6">{settings[item.valueKey]}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="flex justify-center mt-8">
        <Button link="/admin/settings/edit">{I18n.t('generic.edit')}</Button>
      </div>
    </AdminLayout>
  )
}

export default AdminSettingsShow
