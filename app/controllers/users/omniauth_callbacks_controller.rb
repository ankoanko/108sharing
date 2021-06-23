class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  around_action :omniauth

  User.omniauth_providers.each do |provider|
    define_method(provider) do
      yield
    end
  end

  private

  def omniauth_auth
    request.env["omniauth.auth"]
  end

  def omniauth_params
    request.env["omniauth.params"]
  end

  # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
  def omniauth
    return redirect_to stored_location_for(:user) || root_path if omniauth_auth.blank?

    profile = SocialProfile.find_or_initialize_by_omniauth(omniauth_auth)

    # adding account connect case
    if signed_in?
      profile.update!(user_id: current_user.id)
      redirect_to "/settings/identification", notice: "Success."
      return
    end

    user = profile.user || User.build_with_social_profile(profile)

    return redirect_to root_path, alert: t("session.suspended") if user.suspended

    if user.roles.empty?
      return redirect_to new_user_registration_url unless omniauth_params["role_ids"]

      user.role_ids = omniauth_params["role_ids"]
    end

    return redirect_to new_user_registration_url, alert: "連携先サービスにメールアドレスの登録がありません、設定のうえ改めて登録ください" unless user.email_exists

    profile.user = user
    profile.save!
    sign_in(user, event: :authentication)
    flash[:notice] = I18n.t("flash.email_blank") unless user.email_exists
    redirect_to root_path(anchor: user.email_exists ? "" : :email)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity

  # rubocop:disable Naming/AccessorMethodName
  def set_stripe_account(user)
    account = Stripe::Account.retrieve(user.stripe_account_id)
    # not work well
    account.settings.payout.schedule.delay_days = 15
    account.settings.payout_schedule.interval = "monthly"
  end
  # rubocop:enable Naming/AccessorMethodName
end
