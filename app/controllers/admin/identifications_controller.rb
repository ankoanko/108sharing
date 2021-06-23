module Admin
  class IdentificationsController < Admin::BaseController
    include Pagination
    include SortableTable

    def index
      # TODO: replace .includes... with model.with_xx
      identifications = policy_scope(Identification).includes([:user, :identification_images])
      authorize identifications
      # .with_image.with_tags.order(sort_column + ' ' + sort_direction)
      @identifications_json = json_pagination(
        identifications,
        Admin::IdentificationSerializer,
      )
    end
  end
end
