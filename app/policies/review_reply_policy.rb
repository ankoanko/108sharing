class ReviewReplyPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def create?
    record.user_id == record.review.reviewable.user_id
  end
end
