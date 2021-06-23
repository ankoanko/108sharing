class IdentificationsController < ApplicationController
  before_action :authenticate_user!

  def show
    identification = current_user.identification
    @identification_json = IdentificationSerializer.serialize(identification)
    render "settings/identification"
  end
end
