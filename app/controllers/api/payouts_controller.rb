module API
  class PayoutsController < ApplicationController
    before_action :authenticate_user!

    def create
      ActiveRecord::Base.transaction do
        @payout = current_user.payouts.build(payout_params)
        @payout.save!
        @stripe_payout = @payout.create_stripe_payout
      end
      @payout.update_by_remote(@stripe_payout)
      @payout.created_by!(current_user)

      render json: {
        available_balance: current_user.available_balance,
        flush: { message: "振込み申請が完了しました", type: :success },
      }
    rescue Stripe::StripeError => e
      render json: { errors: "Stripeエラー: #{e.message}" }, status: :unprocessable_entity
    rescue => e
      render json: { errors: @payout&.errors&.full_messages || e.message }, status: :unprocessable_entity
    end

    private

    def payout_params
      params.require(:payout).permit(:amount)
    end
  end
end
