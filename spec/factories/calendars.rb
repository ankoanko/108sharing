FactoryBot.define do
  factory :calendar do
    day { Date.current.beginning_of_month + 2.days }
    reserved { false }
    blocked { false }
    daily_price { 7500 }
  end
end

# == Schema Information
#
# Table name: calendars
#
#  id          :bigint(8)        not null, primary key
#  blocked     :boolean          default(FALSE)
#  daily_price :integer
#  day         :date             not null
#  reserved    :boolean          default(FALSE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  post_id     :bigint(8)
#
# Indexes
#
#  index_calendars_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
