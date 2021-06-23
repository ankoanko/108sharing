module API::V1
  class LbController < APIController
    def health
      render json: '{"status": "ok"}'
    end
  end
end
