class Notification::ReviewCreate
  class << self
    include Rails.application.routes.url_helpers

    # rubocop:disable Lint/UselessAssignment
    def recipients(activity)
      review = activity.trackable
      [user] << post.user
    end
    # rubocop:enable Lint/UselessAssignment

    def title(activity)
      "レビューが投稿されました"
    end

    def url
      host_reservations_url
    end

    def send_notification(notification)
      ReservationMailer.review_created(notification).deliver_now
    end
  end
end
