module Admin
  class ContactSerializer < Admin::ApplicationSerializer
    attributes :id, :name, :email, :subject, :body, :status, :note, :user_id, :created_at, :updated_at
  end
end
