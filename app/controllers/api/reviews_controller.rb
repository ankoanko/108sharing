module API
  class ReviewsController < API::ApplicationController
    before_action :authenticate_user!
    after_action :verify_authorized, only: %i[create]

    def create
      review = Review.new review_params
      review.reviewer = current_user
      authorize(review)
      reservation = review.reservation
      review.reviewable = (reservation.user == current_user) ? reservation.post : reservation.user

      if review.save
        render json: {
          review: ReviewSerializer.serialize(review),
          flush: { message: I18n.t("flash.model.create.success", model: Review.model_name.human), type: :success },
        }
      else
        render json: { errors: review.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    private

    def review_params
      params.require(:review).permit(:rating, :body, :reservation_id)
    end
  end
end
