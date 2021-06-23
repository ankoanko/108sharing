module API
  class ReviewRepliesController < API::ApplicationController
    before_action :authenticate_user!

    def create
      @review_reply = ReviewReply.new(review_reply_params)
      @review_reply.user = current_user
      authorize(@review_reply)
      if @review_reply.save
        render json: {
          review_reply: ReviewReplySerializer.serialize(@review_reply),
          flush: {
            message: "レビューに返信しました",
            type: :success,
          },
        }
      else
        render json: { errors: @review_reply.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      respond_to do |format|
        if @review_reply.update(review_reply_params)
          format.html { redirect_to @review_reply, notice: "Review reply was successfully updated." }
          format.json { render :show, status: :ok, location: @review_reply }
        else
          format.html { render :edit }
          format.json { render json: @review_reply.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @review_reply.destroy!
      respond_to do |format|
        format.html { redirect_to review_replies_url, notice: "Review reply was successfully destroyed." }
        format.json { head :no_content }
      end
    end

    private

    def set_review
      @review = Review.find(params[:review_id])
    end

    def set_review_reply
      @review_reply = ReviewReply.find(params[:id])
    end

    def review_reply_params
      params.require(:review_reply).permit(:review_id, :body, :user_id)
    end
  end
end
