OmniAuth.config.test_mode = true

OmniAuth.config.mock_auth[:facebook] = OmniAuth::AuthHash.new(
  { "provider" => "facebook",
    "uid" => "12345",
    "info" =>
    { "email" => "user_1@example.com",
      "name" => "test user",
      "first_name" => "test",
      "last_name" => "user",
      "image" => "http://graph.facebook.com/v2.10/1786655838069384/picture?type=large" },
    "credentials" =>
    { "token" =>
      "dummy_token",
      "expires_at" => 1_553_647_268,
      "expires" => true },
    "extra" =>
    { "raw_info" =>
      { "name" => "test user",
        "first_name" => "test",
        "last_name" => "user",
        "email" => "user_1@examle.com",
        "id" => "12345" } } },
)

OmniAuth.config.mock_auth[:twitter] = OmniAuth::AuthHash.new(
  { "provider" => "twitter",
    "uid" => "12345",
    "info" =>
   { "nickname" => "dummy_nickname",
     "name" => "dummy_name",
     "email" => "user_1@example.com",
     "location" => "dummy location",
     "image" => "http://pbs.twimg.com/profile_images/1068339847369129984/acOqikn1_normal.jpg",
     "description" => "dummy description",
     "urls" => { "Website" => "https://dummy.com", "Twitter" => "https://twitter.com/dummy" } },
    "credentials" => { "token" => "dummy_token", "secret" => "dummy_secret" },
    "raw_info" =>
     { "id" => 12345,
       "id_str" => "21333",
       "name" => "dummy_name",
       "screen_name" => "dummy",
       "location" => "dummy",
       "description" => "dymmy",
       "url" => "https://t.co/dummy",
       "entities" =>
       { "url" =>
         { "urls" =>
                 [{ "url" => "https://t.co/dummy", "expanded_url" => "https://github.com/airbnb", "display_url" => "github.com/airbnb",
                    "indices" => [0, 23] }] },
         "description" =>
           { "urls" =>
                 [{ "url" => "https://t.co/22Sx", "expanded_url" => "http://www.airbnb/", "display_url" => "airbnb", "indices" => [29, 52] }] } },
       "protected" => false,
       "followers_count" => 87,
       "friends_count" => 78,
       "listed_count" => 2,
       "created_at" => "Mon Nov 08 17:16:33 +0000 2010",
       "favorites_count" => 49,
       "utc_offset" => nil,
       "time_zone" => nil,
       "geo_enabled" => true,
       "verified" => false,
       "statuses_count" => 561,
       "lang" => "ja",
       "contributors_enabled" => false,
       "is_translator" => false,
       "is_translation_enabled" => false,
       "profile_background_color" => "EDECE9",
       "profile_background_image_url" => "http://abs.twimg.com/images/themes/theme3/bg.gif",
       "profile_background_image_url_https" => "https://abs.twimg.com/images/themes/theme3/bg.gif",
       "profile_background_tile" => false,
       "profile_image_url" => "http://pbs.twimg.com/profile_images/1068339847369129984/acOqikn1_normal.jpg",
       "profile_image_url_https" => "https://pbs.twimg.com/profile_images/1068339847369129984/acOqikn1_normal.jpg",
       "profile_banner_url" => "https://pbs.twimg.com/profile_banners/213336901/1451148601",
       "profile_link_color" => "088253",
       "profile_sidebar_border_color" => "000000",
       "profile_sidebar_fill_color" => "000000",
       "profile_text_color" => "000000",
       "profile_use_background_image" => true,
       "has_extended_profile" => true,
       "default_profile" => false,
       "default_profile_image" => false,
       "following" => false,
       "follow_request_sent" => false,
       "notifications" => false,
       "translator_type" => "none",
       "suspended" => false,
       "needs_phone_verification" => false,
       "email" => "user_1@example.com" } },
)

OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(
  { "provider" => :google_oauth2,
    "uid" => "12345",
    "info" =>
    { "name" => "John Smith",
      "first_name" => "John",
      "last_name" => "Smith",
      "email" => "user_1@example.com",
      "image" =>
      "https://lh5.googleusercontent.com/-Yo-ztXzV278/AAAAAAAAAAI/AAAAAAAAAA0/WCPQJ6r_9IY/photo.jpg",
      "urls" => { "google" => "https://plus.google.com/100059194827747309752" } },
    "credentials" =>
    { "token" =>
      "dummy_token",
      "expires_at" => 1_548_605_119,
      "expires" => true },
    "extra" =>
    { "id_token" =>
      "dummy_id_token",
      "id_info" =>
      { "iss" => "https://accounts.google.com",
        "azp" => "dummy.apps.googleusercontent.com",
        "aud" => "dummy.apps.googleusercontent.com",
        "sub" => "100059194",
        "hd" => "google.com",
        "email" => "user_1@example.com",
        "email_verified" => true,
        "at_hash" => "ztygeNLY",
        "iat" => 15486,
        "exp" => 1548 },
      "raw_info" =>
      { "sub" => "100059",
        "profile" => "https://plus.google.com/100059",
        "picture" =>
        "https://lh5.googleusercontent.com/-Yo-ztXzV278/AAAAAAAAAAI/AAAAAAAAAA0/WCPQJ6r_9IY/photo.jpg",
        "email" => "user_1@example.com",
        "email_verified" => true,
        "hd" => "google.com" } } },
)

OmniAuth.config.mock_auth[:myrate] = OmniAuth::AuthHash.new({
  "provider" => :myrate,
  "uid" => "12345",
  "info" => {
    "email" => "user_1@example.com",
    "nickname" => "test",
  },
  "credentials" => {
    "token" => "dummy_token",
    "refresh_token" => "dummy_refresh_token",
    "expires" => true,
    "expires_at" => 1_563_005_654,
  },
  "extra" => {
    "raw_info" => {
      "displayName" => "testname",
      "email" => "user_1@example.com",
      "uid" => "12345",
      "rank" => {
        "rank_en" => "Beginner",
        "rank_jp" => "ビギナー",
      },
    },
  },
})

# TODO: stripe_connect追加する
