module API
  class SocialProfilesController < API::ApplicationController
    before_action :authenticate_user!

    def destroy
      current_user.social_profiles.select {|profile| profile.provider == params[:provider] }.each(&:destroy!)

      updated_user = current_user.reload

      render json: {
        user: AccountSerializer.serialize(updated_user),
        flush: { message: I18n.t("flash.social_profile.destroy.success", provider: params[:provider]), type: :success },
      }, status: :ok
    end
  end
end
