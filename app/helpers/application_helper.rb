module ApplicationHelper
  def bootstrap_class_for(flash_type)
    # case flash_type
    # when "success" then "success"
    # when "error"   then "danger"
    # when "alert"   then "error"
    # when "notice"  then "info"
    # end
    flashes = {
      "success" => "success",
      "error" => "error",
      "alert" => "alert",
      "notice" => "notice",
    }
    flashes[flash_type]
  end

  def flash_messages
    flash.map {|type, text| { id: text.object_id, type: bootstrap_class_for(type), text: text } }
  end

  # rubocop:disable Metrics/MethodLength
  def default_meta_tags
    {
      site: Setting.default_site,
      title: Setting.default_title,
      reverse: true,
      charset: "utf-8",
      description: Setting.default_description,
      keywords: Setting.default_keywords,
      canonical: request.original_url,
      separator: "|",
      icon: [
        { href: image_url("/favicon.ico") },
        { href: image_url("/apple-touch-icon.png"), rel: "apple-touch-icon", sizes: "180x180", type: "image/jpg" },
      ],
      og: {
        site_name: Setting.default_site,
        title: Setting.default_title,
        description: Setting.default_description,
        type: "website",
        url: request.original_url,
        image: image_url("/images/apple-touch-icon.png"),
        locale: "ja_JP",
      },
      twitter: {
        card: "summary",
        site: "@twitteracount",
      },
    }
  end
  # rubocop:enable Metrics/MethodLength

  def request_from_demo_site?
    return if Rails.env.test?

    request.domain(2).include?("demo")
  end
end
