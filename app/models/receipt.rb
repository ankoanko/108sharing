class Receipt < ApplicationRecord
  belongs_to :reservation

  before_validation :generate_no

  validates :no, uniqueness: true
  validates :name, length: { maximum: 100 }

  def self.seed
    res = Reservation.first
    res.create_receipt(name: "hayashiki", no: "RCQQFH9NAJ")
  end

  private

  def generate_no
    self.no = SecureRandom.hex(5).gsub(/-/, "").upcase
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
