module Admin
  class PostsSerializer < Admin::ApplicationSerializer
    attributes :id, :slug, :name, :description, :price, :aasm_state, :latitude, :longitude

    attribute :published_at do |obj|
      I18n.l obj.published_at if obj.published_at.present?
    end
  end
end
