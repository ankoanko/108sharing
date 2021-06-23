module API
  class CollectionCalendarsController < API::ApplicationController
    before_action :authenticate_user!
    # after_action :verify_authorized, except: [:index]

    def create
      post = Post.find params[:post_id]
      form = Form::CreateCollectionCalendar.new(post, calendar_bulk_form_params)
      if form.save
        render json: {
          calendars: form.calendars,
          flush: { message: I18n.t("flash.model.update.success", model: Calendar.model_name.human), type: :success },
        }
      else
        render json: {
          calendars: form.calendars,
          flush: { message: form.errors.full_messages.join(","), type: :error },
        }
      end
    end

    private

    def calendar_bulk_form_params
      params.require(:post).permit(
        calendar_attributes: [:blocked, :reserved, :daily_price, :day],
      )
    end
  end
end
