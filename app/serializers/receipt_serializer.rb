class ReceiptSerializer < ApplicationSerializer
  attributes :id, :name, :no

  belongs_to :reservation, serializer: ReservationsSerializer

  attribute :created_at do |obj|
    I18n.l obj.created_at if obj.created_at.present?
  end

  def self.opt_include
    [:reservation]
  end
end

# == Schema Information
#
# Table name: receipts
#
#  id             :bigint(8)        not null, primary key
#  name           :string
#  no             :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  reservation_id :bigint(8)
#
# Indexes
#
#  index_receipts_on_reservation_id  (reservation_id)
#
