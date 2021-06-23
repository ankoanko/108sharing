module ActsAsSluggable
  extend ActiveSupport::Concern

  included do
    before_validation :ensure_slug, on: :create

    extend FriendlyId
    friendly_id :slug
  end

  def ensure_slug
    return if slug.present?

    klass = self.class.name.safe_constantize
    self.slug = begin
      slug = SecureRandom.hex(8)
      raise if klass.where(slug: slug).exists?

      slug
                rescue
                  retry
    end
  end
end
