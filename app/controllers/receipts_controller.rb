class ReceiptsController < ApplicationController
  before_action :set_receipt, only: %i[show]

  def show
    @reservation = @receipt.reservation

    render pdf: "#{@reservation.user.username}様_領収書",
           layout: "pdf.html.erb",
           template: "receipts/show.html.erb",
           encoding: "UTF-8",
           #  orientation: 'Landscape',
           page_size: "A4",
           margin: {
             top: 10,
             bottom: 10,
             left: 20,
             right: 20,
           },
           dpi: "300",
           show_as_html: params[:debug].present?
  end

  private

  def set_receipt
    @receipt = Receipt.find(params[:id])
  end

  def receipt_params
    params.require(:receipt).permit(:reservation, :name, :no)
  end
end
