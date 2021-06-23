module Admin
  class AnnouncementSerializer < Admin::ApplicationSerializer
    attributes :id, :title, :body, :url, :publish_at

    attribute :created_at do |obj|
      I18n.l obj.created_at if obj.created_at.present?
    end
  end
end
