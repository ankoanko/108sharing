module API
  class ReceiptsController < API::ApplicationController
    before_action :authenticate_user!

    def create
      receipt = Receipt.new(receipt_params)
      receipt.save!

      render json: {
        receipt: ReceiptSerializer.serialize(receipt),
        flush: { message: I18n.t("flash.model.create.success", model: Receipt.model_name.human), type: :success },
      }, status: :ok
    end

    private

    def receipt_params
      params.require(:receipt).permit(:reservation_id, :name)
    end
  end
end
