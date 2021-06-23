# RailsSettings Model
class Setting < RailsSettings::Base
  include GlobalSetting

  field :default_site, type: :string, default: "SharingEconomyScript"
  field :default_title, type: :string, default: "SharingEconomyScript"
  field :default_description, type: :string, default: "SharingeEconomyScript"
  field :default_keywords, type: :string, default: "Sharing, Economy"
  field :ga_tracking_id, type: :string, default: nil
  field :payment_required, type: :boolean, default: true
  field :skip_identification, type: :boolean, default: false
  field :skip_profile, type: :boolean, default: false

  # MAILER_FROM_DEFAULT_VALUE = 'support@example.com'
  field :mailer_from_default, type: :string, default: ENV["MAILER_FROM_DEFAULT"], readonly: true

  def self.update(values)
    values.to_h.with_indifferent_access.slice(*AVAILABLE_SETTINGS).map {|k, v| send("#{k}=", v) }
  end

  def self.find_or_create_editable_settings
    settings = []
    Setting::EDITABLE_SETTING.each do |available_setting|
      setting = Setting.find_by(var: available_setting)
      setting = Setting.create!(var: available_setting) if setting.blank?
      settings.append(setting)
    end
    settings
  end
end

# == Schema Information
#
# Table name: settings
#
#  id         :bigint(8)        not null, primary key
#  thing_type :string(30)
#  value      :text
#  var        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  thing_id   :integer
#
# Indexes
#
#  index_settings_on_thing_type_and_thing_id_and_var  (thing_type,thing_id,var) UNIQUE
#
