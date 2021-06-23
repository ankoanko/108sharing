module Admin
  class SettingsController < Admin::BaseController
    def show
      authorize(Setting.new)
      @settings = Setting.find_or_create_editable_settings
    end

    def edit
      authorize(Setting.new)
      @settings = Setting.find_or_create_editable_settings
    end
  end
end
