class ReviewPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def new?
    true
  end

  def index?
    true
  end

  def show?
    true
  end

  def create?
    record.reviewer == user
  end

  def update?
    owner_or_admin?
  end

  def close?
    owner_or_admin?
  end

  def reopen?
    owner_or_admin?
  end
end
