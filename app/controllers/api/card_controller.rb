module API
  class CardController < API::ApplicationController
    before_action :authenticate_user!

    def show
      card = current_user.card
      render json: card
    end

    def create
      card = current_user.create_or_update_stripe_default_card(params[:stripeToken])
      render json: {
        card: card,
        flush: { message: I18n.t("flash.model.create.success", model: Card.model_name.human), type: :success },
      }
    rescue Stripe::CardError => e
      render json: {
        card: current_user.card,
        flush: { message: e.message, type: :error },
      }
    end

    def destroy
      user.card.destroy!
      # todo
      # delete from stripe
      render json: :ok
    end
  end
end
