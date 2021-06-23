module Admin
  class TagSerializer < Admin::ApplicationSerializer
    attributes :id, :name, :position
  end
end
