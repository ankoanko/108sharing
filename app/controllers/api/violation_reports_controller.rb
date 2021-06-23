class API::ViolationReportsController < API::ApplicationController
  ENTITY_ROUTES = /(posts|user)/
  before_action :authenticate_user!
  before_action :violation_report_params, only: %i[create]
  before_action :find_reportable_type, only: %i[create]
  after_action :verify_authorized, only: %i[create]

  def create
    violation_report = @target_resource.violation_reports.build violation_report_params
    violation_report.reported_by = current_user
    authorize(violation_report)

    if violation_report.save
      render json: ViolationReportSerializer.serialize(violation_report)
    else
      render json: { errors: violation_report.errors.full_messages.join(",") }, status: :unprocessable_entity
    end
  end

  private

  def find_reportable_type
    class_name = request.fullpath.match(ENTITY_ROUTES)[0]
    clazz = class_name.classify.constantize
    @target_resource = clazz.find params["#{class_name.singularize}_id"]
  end

  def violation_report_params
    params.require(:violation_report).permit(:violation_type, :content)
  end
end
