class OAuthPolicy::GoogleOauth2 < OAuthPolicy::Base
  def initialize(auth)
    @provider    = auth["provider"]
    @uid         = auth["uid"]
    @name        = auth["info"]["name"]
    @nickname    = ""
    @email       = auth["info"]["email"]
    @url         = "https://www.facebook.com/"
    @image_url   = auth["info"]["image"]
    @description = ""
    @credentials = auth["credentials"].to_json
    @raw_info    = auth["extra"]["raw_info"].to_json
    freeze
  end
end
