module Admin::API
  class SettingController < Admin::API::BaseController
    # def index
    #   authorize(Setting.new)
    #   @settings = Setting.find_or_create_editable_settings
    # end

    # def show
    #   authorize @setting = Setting.find_by_id(params[:id])
    #   render json: {
    #     setting: @setting
    #   }, status: :ok
    # end

    def update
      authorize(Setting.new)
      if Setting.update(setting_params)
        render json: {
          settings: Setting.find_or_create_editable_settings,
          flush: { message: I18n.t("flash.model.create.success", model: Setting.model_name.human), type: :success },
        }, status: :ok
      else
        render json: { errors: @user.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    private

    def update_global_settings
      Setting.update(setting_params)
    end

    def setting_casted_params
      setting_params.to_h.transform_values {|x| ActiveModel::Type::Boolean.new.cast(x) }
    end

    def setting_params
      params.permit(Setting::EDITABLE_SETTING)
    end
  end
end
