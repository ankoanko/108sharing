class OAuthPolicy::Twitter < OAuthPolicy::Base
  # rubocop:disable Metrics/AbcSize
  def initialize(auth)
    @provider = auth["provider"]
    @uid = auth["uid"]
    @name = auth["info"]["name"]
    @nickname = auth["info"]["nickname"]
    @email = auth["info"]["email"]
    @url = auth["info"]["urls"]["Twitter"]
    @image_url = auth["info"]["image"]
    @description = auth["info"]["description"]&.truncate(255)
    @credentials = JSON.parse(auth["credentials"].to_json)
    @raw_info    = auth["extra"]["raw_info"].to_json
    freeze
  end
  # rubocop:enable Metrics/AbcSize
end
