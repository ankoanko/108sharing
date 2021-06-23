class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def show?
    true
  end

  def edit?
    user_present?
  end

  def cards?
    user_present?
  end

  def update?
    user_present?
  end

  def profile?
    user_present?
  end

  def bank_account?
    user_present?
  end

  def custom_profile?
    user_present?
  end
end
