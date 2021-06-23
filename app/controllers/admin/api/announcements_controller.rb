module Admin
  module Api
    class AnnouncementsController < Admin::BaseController
      before_action :set_announcement, only: [:update, :destroy]

      def create
        @announcement = Announcement.new(create_announcement_params)
        @announcement.user = current_user
        authorize @announcement
        if @announcement.save
          @announcement_json = AnnouncementSerializer.serialize(@announcement)
          render json: {
            announcement: @announcement_json,
            flush: { message: I18n.t("flash.model.create.success", model: Announcement.model_name.human), type: :success },
          }, status: :created
        else
          render json: {
            errors: @announcement.errors.full_messages,
          }, status: :unprocessable_entity
        end
      end

      def update
        if @announcement.update(update_announcement_params)
          @announcement_json = AnnouncementSerializer.serialize(@announcement)
          render json: {
            announcement: @announcement_json,
            flush: { message: I18n.t("flash.model.update.success", model: Announcement.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @announcement.errors.full_messages,
          }, status: :unprocessable_entity
        end
      end

      def destroy
        if @announcement.destroy
          render json: {
            flush: { message: I18n.t("flash.model.delete.success", model: Announcement.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @announcement.errors.full_messages,
          }, status: :unprocessable_entity
        end
      end

      private

      def set_announcement
        @announcement = Announcement.find(params[:id])
        authorize @announcement
      end

      def update_announcement_params
        params.require(:announcement).permit(:title, :url)
      end

      def create_announcement_params
        params.permit(:title, :url)
      end
    end
  end
end
