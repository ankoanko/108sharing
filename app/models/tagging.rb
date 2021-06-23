class Tagging < ApplicationRecord
  belongs_to :tag
  belongs_to :taggable, polymorphic: true
end

# == Schema Information
#
# Table name: taggings
#
#  id            :bigint(8)        not null, primary key
#  position      :integer
#  taggable_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  tag_id        :integer
#  taggable_id   :bigint(8)
#
# Indexes
#
#  index_taggings_on_taggable_type_and_taggable_id  (taggable_type,taggable_id)
#
