module Admin
  class AnnouncementsController < Admin::BaseController
    before_action :set_announcement, only: %i[edit]
    include Pagination
    include SortableTable

    def index
      announcements = policy_scope(Announcement).recent
      authorize announcements
      @announcements_json = json_pagination(announcements, AnnouncementSerializer)
    end

    def new
      @announcement = Announcement.new
      authorize @announcement
    end

    def edit
      @announcement_json = AnnouncementSerializer.serialize(@announcement)
    end

    private

    def set_announcement
      @announcement = Announcement.find(params[:id])
      authorize @announcement
    end
  end
end
