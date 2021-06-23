module API
  class CalendarsController < API::ApplicationController
    def index
      post = Post.find params[:post_id]

      scope = post.calendars.filter_by_date_range(Chronic.parse(filter_params[:month])&.to_date || Date.current)

      filter_scopes = %i[blocked reserved defined_price]
      filters = filter_scopes.select {|k| bool_true?(filter_params[k]) }

      calendars = scope.apply_or_filter(scope, filters, post.price)
      calendars_json = CalendarSerializer.new(calendars).serializable_hash

      render json: { calendars: calendars_json }
    end

    private

    def filter_params
      params.require(:filter).permit([:month, :reserved, :blocked, :defined_price])
    end

    def bool_true?(value)
      value.presence ? ActiveRecord::Type::Boolean.new.cast(value) : false
    end
  end
end
