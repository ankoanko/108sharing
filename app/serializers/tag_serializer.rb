class TagSerializer < ApplicationSerializer
  attributes :id, :name, :position
  cache_options store: Rails.cache, namespace: "jsonapi-serializer", expires_in: 1.days
end

# == Schema Information
#
# Table name: tags
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  name_en    :string
#  name_ja    :string
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
