module Admin
  class IdentificationsController < Admin::BaseController
    before_action :set_identification, only: %i[show edit update destroy]

    include Pagination
    include SortableTable

    def index
      identifications = policy_scope(Identification).order("#{sort_column} #{sort_direction}")
      authorize identifications

      identifications_json = json_pagination(
        identifications,
        IdentificationSerializer,
      )
      render json: identifications_json
    end

    def show
      current_user.identifications.approved.any?
    end

    def new
      @identification = current_user.identifications.new
    end

    def edit
    end

    def update
      respond_to do |format|
        if @identification.update(identification_params)
          format.html { redirect_to @identification, notice: "Identification was successfully updated." }
          format.json { render :show, status: :ok, location: @identification }
        else
          format.html { render :edit }
          format.json { render json: @identification.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @identification.destroy!
      respond_to do |format|
        format.html { redirect_to identifications_url, notice: "Identification was successfully destroyed." }
        format.json { head :no_content }
      end
    end

    private

    def set_identification
      @identification = Identification.find params[:id]
    end

    def identification_params
      params.require(:identification).permit(:user_id, :description, :workflow_state, :image)
    end
  end
end
