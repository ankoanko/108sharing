class PostSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :description, :aasm_state,
             :aasm_state_i18n, :published, :latitude, :longitude, :viewed_count,
             :avarage_review_score, :public_address, :full_address,
             :note, :size, :capacity, :functionality,
             :zipcode, :state, :city, :street1, :street2

  belongs_to :user, serializer: UserSerializer
  belongs_to :category, serializer: CategorySerializer
  has_many :post_images, serializer: PostImageSerializer
  has_many :tags, serializer: TagSerializer
  has_many :reviews, serializer: ReviewSerializer

  attribute :price do |obj|
    obj.price.to_s(:delimited)
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at if obj.created_at.present?
  end

  attribute :price_numeric, &:price

  attribute :updated_at do |obj|
    I18n.l obj.updated_at if obj.updated_at.present?
  end

  # formatted_published_day
  attribute :published_at do |obj|
    I18n.l obj.published_at if obj.published_at.present?
  end

  attribute :user_liked do |obj, params|
    current_user = params[:current_user]
    if current_user
      current_user.voted_for?(obj)
    end
  end

  def self.opt_include
    [:'reviews.review_reply', :'reviews.reviewer', :tags, :user, :category, :post_images, :reviews]
  end
end

# == Schema Information
#
# Table name: posts
#
#  id            :bigint(8)        not null, primary key
#  aasm_state    :integer          default("draft")
#  capacity      :string
#  city          :string
#  country       :string
#  currency      :string           default("jpy")
#  description   :text
#  functionality :string
#  instant       :integer          default("request"), not null
#  integer       :integer          default(0)
#  latitude      :float
#  likes_count   :integer          default(0), not null
#  longitude     :float
#  name          :string           not null
#  note          :text
#  price         :integer          default(0), not null
#  published_at  :datetime
#  reviews_count :integer          default(0)
#  size          :string
#  slug          :string
#  state         :string
#  street1       :string
#  street2       :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :bigint(8)
#  condition_id  :bigint(8)
#  user_id       :bigint(8)
#
# Indexes
#
#  index_posts_on_category_id   (category_id)
#  index_posts_on_condition_id  (condition_id)
#  index_posts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (condition_id => conditions.id)
#  fk_rails_...  (user_id => users.id)
#
