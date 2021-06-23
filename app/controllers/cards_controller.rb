class CardsController < ApplicationController
  before_action :authenticate_user!

  def show
    @card = current_user.card
    render "settings/card"
  end
end
