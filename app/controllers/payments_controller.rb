class PaymentsController < ApplicationController
  before_action :authenticate_user!

  include Pagination
  include SortableTable

  def index
    scope = current_user.reservations.receipt_accessible
    scope = scope.filtered_by(filtered_params) if filtered_params[:states].present?

    payment_json = json_pagination(
      scope,
      PaymentSerializer,
      { params: { current_user: current_user } },
    )
    render json: payment_json if request.xhr?
  end

  private

  def filtered_params
    params.permit(states: [])
  end
end
