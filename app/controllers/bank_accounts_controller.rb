class BankAccountsController < ApplicationController
  before_action :authenticate_user!

  include Pagination
  include SortableTable

  # rubocop:disable Metrics/AbcSize
  def show
    redirect_to root_path unless current_user.host?
    current_user.check_stripe_verification
    current_user.payouts.pending.each(&:update_by_remote)

    @user_json = UserSerializer.serialize(current_user)
    @identification_json = IdentificationSerializer.serialize(current_user.identification)
    @bank_account_json = BankAccountSerializer.serialize(current_user.bank_account)
    @address_json = AddressSerializer.serialize(current_user.address)
    @payment_histories_json = json_pagination(
      current_user.payment_histories.with_activity.recent,
      ::PaymentHistoriesSerializer,
    )
    @available_balance = current_user.available_balance
  end
  # rubocop:enable Metrics/AbcSize
end
