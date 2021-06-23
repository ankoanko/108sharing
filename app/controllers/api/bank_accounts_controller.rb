module API
  class BankAccountsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_bank_account, only: [:update]
    # before_action :create_stripe_account, only: [:create, :update]

    def create
      ActiveRecord::Base.transaction do
        @bank_account = current_user.build_bank_account(bank_account_params)
        @bank_account.save!
        # current_user.create_or_update_stripe_external_account
      end

      render json: {
        bank_account: BankAccountSerializer.serialize(@bank_account),
        flush: { message: I18n.t("flash.model.create.success", model: BankAccount.model_name.human), type: :success },
      }

      # rescue Stripe::CardError => e
      #   puts "Status is: #{e.http_status}"
      #   puts "Type is: #{e.error.type}"
      #   puts "Charge ID is: #{e.error.charge}"
      #   # The following fields are optional
      #   puts "Code is: #{e.error.code}" if e.error.code
      #   puts "Decline code is: #{e.error.decline_code}" if e.error.decline_code
      #   puts "Param is: #{e.error.param}" if e.error.param
      #   puts "Message is: #{e.error.message}" if e.error.message
      # rescue Stripe::RateLimitError => e
      #   # Too many requests made to the API too quickly
      #   return render json: { errors: "Stripeエラー:#{e.message}" }, status: :unprocessable_entity
      # rescue Stripe::InvalidRequestError => e
      #   # Invalid parameters were supplied to Stripe's API
      #   return render json: { errors: "Stripeエラー:#{e.message}" }, status: :unprocessable_entity
      # rescue Stripe::AuthenticationError => e
      #   # Authentication with Stripe's API failed
      #   # (maybe you changed API keys recently)
      #   return render json: { errors: "Stripeエラー:#{e.message}" }, status: :unprocessable_entity
      # rescue Stripe::APIConnectionError => e
      #   # Network communication with Stripe failed
      #   return render json: { errors: "Stripeエラー:#{e.message}" }, status: :unprocessable_entity
      # rescue Stripe::StripeError => e
      # Display a very generic error to the user, and maybe send
      # yourself an email
      #   render json: { errors: "Stripeエラー: #{e.message}" }, status: :unprocessable_entity
    rescue
      render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
    end

    def update
      ActiveRecord::Base.transaction do
        @bank_account.update!(bank_account_params)
        # current_user.create_or_update_stripe_external_account
      end
      render json: {
        bank_account: BankAccountSerializer.serialize(@bank_account),
        flush: { message: I18n.t("flash.model.update.success", model: BankAccount.model_name.human), type: :success },
      }
    # rescue Stripe::StripeError => e
    #  render json: { errors: "Stripeエラー: #{e.message}" }, status: :unprocessable_entity
    rescue
      render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
    end

    private

    def bank_account_params
      params.require(:bank_account).permit(
        :bank_name, :branch_name, :number, :name, :account_type, :bank_code, :branch_code
      )
    end

    def set_bank_account
      @bank_account = BankAccount.find(params[:id])
    end

    def create_stripe_account
      # this should be out of transaction
      current_user.create_stripe_account if current_user.stripe_account_id.blank?
    end
  end
end
