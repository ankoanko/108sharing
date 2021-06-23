module Admin
  class IdentificationSerializer < Admin::ApplicationSerializer
    attributes :id, :workflow_state, :description

    belongs_to :user, serializer: Admin::UserSerializer
    has_many :identification_images, serializer: Admin::IdentificationImageSerializer

    def self.opt_include
      [:user, :identification_images]
    end
  end
end
