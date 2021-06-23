class ReservationPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user&.conversations || scope.nonw
    end
  end

  def show?
    record.users.include?(user)
  end

  def between?
    user_present?
  end

  def create?
    record.post.user != user
  end

  def update?
    return false if user.nil?

    record.users.include?(user)
  end

  def destroy?
    return false if user.nil?

    record.users.include?(user)
  end
end
