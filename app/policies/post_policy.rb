class PostPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def new?
    user_present?
  end

  def index?
    true
  end

  def search?
    true
  end

  def calculate?
    true
  end

  def toggle_like?
    true
  end

  def show?
    true
  end

  def create?
    user_present?
  end

  def authorize?
    true
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

  def publish?
    owner_or_admin?
  end

  def destroy?
    owner_or_admin?
  end
end
