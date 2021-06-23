require "rails_helper"

RSpec.describe IdentificationImage, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: identification_images
#
#  id                :bigint(8)        not null, primary key
#  description       :text
#  position          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  identification_id :bigint(8)
#
# Indexes
#
#  index_identification_images_on_identification_id  (identification_id)
#
# Foreign Keys
#
#  fk_rails_...  (identification_id => identifications.id)
#
