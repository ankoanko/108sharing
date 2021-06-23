class StaticPagesController < ApplicationController
  def top
    @categories_json = CategorySerializer.serializer_array(Category.all.by_position)

    render layout: "top"
  end

  def terms_of_use
    redirect_to Settings.static_page.terms_of_use if Settings.static_page.terms_of_use.present?
  end

  def policy
    redirect_to Settings.static_page.policy if Settings.static_page.terms_of_use.present?
  end

  def email_demo
    render layout: false
  end

  def payment_history
    render "settings/payment_history"
  end

  def business_registration
    render "settings/business_registration"
  end
end
