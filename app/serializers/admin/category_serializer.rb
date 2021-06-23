module Admin
  class CategorySerializer < Admin::ApplicationSerializer
    attributes :id, :name, :position
  end
end
