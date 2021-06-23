class PostsSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :description,
             :aasm_state_i18n, :published, :latitude, :longitude, :viewed_count,
             :avarage_review_score, :public_address, :full_address,
             :note, :size, :capacity, :functionality,
             :zipcode, :state, :city, :street1, :street2

  belongs_to :user, serializer: UserSerializer
  belongs_to :category, serializer: CategorySerializer
  has_one :post_image, serializer: PostImageSerializer
  has_many :tags, serializer: TagSerializer
  has_many :reviews, serializer: ReviewSerializer

  attribute :price do |obj|
    obj.price.to_s(:delimited)
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at
  end

  attribute :updated_at do |obj|
    I18n.l obj.updated_at if obj.updated_at.present?
  end

  # formatted_published_day
  attribute :published_at do |obj|
    I18n.l obj.published_at if obj.published_at.present?
  end

  attribute :user_liked do |obj, params|
    current_user = params[:current_user]
    current_user.voted_for?(obj) if current_user.present?
  end

  def self.opt_include
    [:tags, :post_image, :user, :category, :reviews]
  end
end
