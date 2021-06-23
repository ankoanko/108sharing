class NotificationsSerializer < ApplicationSerializer
  attributes :id, :title, :url, :activity_key

  attribute :created_at, &:created_time_ago

  attribute :read_at do |obj|
    I18n.l obj.read_at if obj.read_at.present?
  end
end
