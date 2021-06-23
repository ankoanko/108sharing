require "csv"

# Settings

Setting.default_site = "108sharing"
Setting.default_title = "108sharing"
Setting.default_description = 'SharingeEconomyScript'
Setting.default_keywords = "Sharing, Economy"
Setting.payment_required = true
Setting.skip_identification = false
Setting.skip_profile = false
# Setting.mailer_from_default = "support@example.com"

puts "Clearing old data..."
%w(Review Conversation ConversationUser Calendar Reservation Card PostImage Post User).map{ |klass| klass.to_s.classify.safe_constantize.delete_all }

puts "Creating master..."
[:category, :tag].each do |klass_name|
  klass = "#{klass_name.to_s.classify}".safe_constantize
  puts "data loading for #{klass}"
  klass.delete_all
  CSV.open("#{Rails.root}/db/masters/#{klass_name.to_s.pluralize}.csv",
    {headers: true, header_converters: :downcase}).each do |row|
      attrs = row.to_hash
      klass.create! attrs
  end
end
puts "Created master..."

puts "Creating role..."
admin_role, host_role, guest_role = %w[admin host guest].map { |name| Role.create!(name: name) }
puts "Created role..."

puts "Creating user..."
User.create(username: 'admin1', email: "admin@example.com", password: 'shareusers', roles: [admin_role, host_role, guest_role], confirmed_at: Time.current)

host = User.create(
  fullname: 'yamanaka taro',
  username: 'taro',
  email: "user@example.com",
  password: 'shareusers',
  roles: [host_role, guest_role],
  bio: 'はじめまして。太郎と申します。都内に住んでおりますので、何かございましたらいつでもご連絡ください。すぐに対応いたします。',
  confirmed_at: Time.current)

host.avatar.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "face-1391628_1920.jpg")), filename: 'face-1391628_1920.jpg')

guest = User.create(
  fullname: 'sasada',
  username: 'hanako',
  email: "guest@example.com",
  password: 'shareusers',
  roles: [host_role, guest_role],
  bio: 'はじめまして。花子と申します。埼玉に住んでおります。リプは一時間以内を目指しています',
  confirmed_at: Time.current)

user = User.create(
  fullname: 'kojima',
  username: 'syo',
  email: "user_guest@example.com",
  password: 'shareusers',
  roles: [guest_role],
  bio: 'はじめまして。kojimaです',
  confirmed_at: Time.current)

User.create(
  fullname: 'saito takeru',
  username: 'takeru',
  email: "user_host@example.com",
  password: 'shareusers',
  roles: [host_role],
  bio: 'はじめまして。takeruです',
  confirmed_at: Time.current)

puts "Created user..."

puts "Creating post..."
# 適当に追加を。　https://www.geocoding.jp/

puts "data loading for Post"
CSV.open("#{Rails.root}/db/masters/posts.csv",
  {headers: true, header_converters: :downcase}).each do |row|
    attrs = row.to_hash
    attrs["user_id"] = User.second.id
    attrs["category_id"] = Category.first.id
    attrs["name"] = Faker::Food.spice
    attrs["description"] = Faker::Food.description
    post_from_csv = Post.create! attrs
    post_from_csv.publish
    post_from_csv.save!
    post_image4 = post_from_csv.post_images.build
    post_image4.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "apartment-2094666.jpg")), filename: 'apartment-2094666.jpg')
    post_image4.save!
    15.times do |i|
      date = Time.zone.today - (i += 1 )
      post_from_csv.calendars.create(day: date, daily_price: post_from_csv.price)
    end
    15.times do |i|
      date = Time.zone.today + (i += 1 )
      post_from_csv.calendars.create(day: date, daily_price: post_from_csv.price)
    end
end
puts "Created post from csv..."

fix_note = "Please contact us if there are mistakes in the number of people. If you stay over the number of people you want, you will be charged a fee and a penalty.
宿泊人数に間違いがある場合はご連絡ください｡意図して予約した人数より多く宿泊した場合は追加料金と違約金を請求します｡

･午後10時以降は騒音禁止
Noise prohibition after 10 pm.

･他に住人がいるため廊下･階段での会話禁止
There are people living in other rooms. Prohibition of talk in hallways and stairs."

post = host.posts.create(
  name: "駅･スカイツリーから徒歩6分！立地最高の無料Wi-FI付、最大3名収容物件！",
  slug: "849141268169c711",
  price: 10000,
  description: "ようこそ東京へ！
  利便性の高い立地で､押上駅から徒歩6分｡スカイツリーからも徒歩6分です｡成田空港､羽田空港から直通です。コンビニやスーパーなど周辺施設も充実しています。
  ビジネス旅行にも､ご友人での旅行にも大変おすすめです!",
  category: Category.first,
  tags: [ Tag.first, Tag.last],
  city: "東京",
  state: "墨田区",
  latitude: 35.658581, longitude: 139.745433,
  note: fix_note
  )
   # 東京タワー
post.publish
post.save!
post_image1 = post.post_images.build
post_image1.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "apartment-2094666.jpg")), filename: 'apartment-2094666.jpg')
post_image1.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "chairs-2181960_1920.jpg")), filename: 'apartment-2094666.jpg')
post_image1.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "couch-1835923_1920.jpg")), filename: 'apartment-2094666.jpg')
post_image1.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "home-1622401_1920.jpg")), filename: 'apartment-2094666.jpg')
post_image1.save!

post2 = host.posts.create(
  name: "一軒家の12畳和室  代々木､代々木公園駅より徒歩8分",
  slug: "d154d2082190345f",
  price: 20000,
  description: "2ようこそ東京へ！\n
  利便性の高い立地で､押上駅から徒歩6分｡スカイツリーからも徒歩6分です｡成田空港､羽田空港から直通です。コンビニやスーパーなど周辺施設も充実しています。
  ビジネス旅行にも､ご友人での旅行にも大変おすすめです!",
  city: "横浜",
  state: "桜木町",
  latitude: 35.454954, longitude: 139.631386, # 横浜ランドマークタワー
  note: fix_note
  )
post2.publish
post2.save!
post_image2 = post2.post_images.build
post_image2.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "apartment-2094666.jpg")), filename: 'apartment-2094666.jpg')
post_image2.save!

post3 = host.posts.create(
  name: "駅･スカイツリーから徒歩6分！立地最高の無料Wi-FI付、最大3名収容物件！",
  slug: "849141268169c719",
  price: 17000,
  description: "ようこそ東京へ！\n
  利便性の高い立地で､押上駅から徒歩6分｡スカイツリーからも徒歩6分です｡成田空港､羽田空港から直通です。コンビニやスーパーなど周辺施設も充実しています。
  ビジネス旅行にも､ご友人での旅行にも大変おすすめです!",
  category: Category.first,
  tags: [ Tag.first, Tag.last],
  city: "埼玉",
  state: "川口市",
  latitude: 35.907116, longitude: 139.482444) # 川越駅
# post3.publish
post3.publish
post3.save!
post_image3 = post3.post_images.build
post_image3.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "apartment-2094666.jpg")), filename: 'apartment-2094666.jpg')
post_image3.save!

puts "Created post..."

Post.first.calendars.create(day: Date.current + 30.day, reserved: true)
Post.first.calendars.create(day: Date.current + 31.day, reserved: true)
Post.first.calendars.create(day: Date.current + 32.day, daily_price: 5000)
Post.first.calendars.create(day: Date.current + 33.day, daily_price: 5000)
Post.first.calendars.create(day: Date.current + 34.day, daily_price: 5000)
Post.first.calendars.create(day: Date.current + 35.day, daily_price: 5000)
Post.first.calendars.create(day: Date.current + 36.day, daily_price: 5000)

post = Post.first

ActiveJob::Base.queue_adapter = Rails.application.config.active_job.queue_adapter

identification = Identification.find_or_create_by(user_id: guest.id, workflow_state: :approved)
identification_image = identification.identification_images.new
identification_image.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "license.jpg")), filename: 'license.jpg')
identification.save!

reservation = post.reservations.create!(user: guest, start_date: Date.current, end_date: Date.current + 5.day, price: 30000, initial_message: "さっそく具体的なチェック時間を相談させてください！")
reservation = Reservation.first

# reservation.conversation.messages.create(sender: guest, body: "歯ブラシはついてますか？")
# reservation.conversation.messages.create(sender_id: user.id, body: "ついてます")
# reservation.conversation.messages.create(sender: guest, body: "ありがとうございます！！！")
# reservation.conversation.messages.create(sender_id: user.id, body: "当日はお気をつけておこしくださいね")

review_from_guest_to_post = reservation.reviews.create(reviewable: reservation.post, rating: 4, body: "とてもきれいな部屋で快適でした", reviewer: guest)
review_from_host_to_guest = reservation.reviews.create(reviewable: reservation.user, rating: 4, body: "きれいに使っていただけました！", reviewer_id: reservation.post.user.id)



identification = Identification.find_or_create_by(user_id: host.id, workflow_state: :approved)
identification_image = identification.identification_images.new
identification_image.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "license.jpg")), filename: 'license.jpg')
identification.save!

card = Card.create(
  user_id: guest.id,
  stripe_card_id: "card_1GYowSHDvis3JRozgn",
  fingerprint: "ZHCezBP3Tri",
  active: true,
  last4: "1111",
  brand: "Visa",
  exp_month: 6,
  exp_year: 2022,
  cvc_check: "pass",
)

post.reservations.create!(user: guest, workflow_state: :approved, start_date: 10.days.ago, end_date: 8.days.ago, price: 30000, initial_message: "さっそく具体的なチェック時間を相談させてください！")
post.reservations.create!(user: guest, workflow_state: :declined, start_date: 9.days.ago, end_date: 7.days.ago, price: 30000, initial_message: "さっそく具体的なチェック時間を相談させてください！")
post.reservations.create!(user: guest, workflow_state: :canceled, start_date: 8.days.ago, end_date: 6.days.ago, price: 30000, initial_message: "さっそく具体的なチェック時間を相談させてください！")


identification = Identification.find_or_create_by(user_id: user.id, workflow_state: :approved)
identification_image = identification.identification_images.new
identification_image.image.attach(io: File.open(Rails.root.join("spec/fixtures/images/", "license.jpg")), filename: 'license.jpg')
identification.save!

# 予約データの作成
# approved reservations of guest
10.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: guest.id,
    start_date: Faker::Date.between(from: 10.days.ago, to: 7.days.ago),
    end_date: Faker::Date.forward(days: 5),
    workflow_state: :approved,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: nil,
    canceled_at: nil,
    stripe_charge_id: nil,
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# approved and paid reservations of guest
10.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: guest.id,
    start_date: Faker::Date.between(from: 10.days.ago, to: 7.days.ago),
    end_date: 5.days.ago,
    workflow_state: :approved,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: 4.days.ago,
    canceled_at: nil,
    stripe_charge_id: Faker::Number.within(range: 100..110),
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# requested reservations of guest
5.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: guest.id,
    start_date: Faker::Date.forward(days: 7),
    end_date: Faker::Date.between(from: 7.days.from_now, to: 12.days.from_now),
    workflow_state: :requested,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: nil,
    canceled_at: nil,
    stripe_charge_id: nil,
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# declined reservations of guest
2.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: guest.id,
    start_date: Faker::Date.forward(days: 7),
    end_date: Faker::Date.between(from: 7.days.from_now, to: 12.days.from_now),
    workflow_state: :declined,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: nil,
    canceled_at: nil,
    stripe_charge_id: nil,
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# canceled and have cancel fee reservations of guest
3.times do |i|
  post = Post.published.sample
  reservation = post.reservations.create!(
    user_id: guest.id,
    start_date: 10.days.ago,
    end_date: Faker::Date.between(from: 5.days.ago, to: 3.days.from_now),
    workflow_state: :canceled,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: 9.days.ago,
    canceled_at: 10.days.ago,
    stripe_charge_id: Faker::Number.within(range: 120..130),
    stripe_refund_id: nil,
    refund_amount: 5000
  )
  reservation.cancel_fee = reservation.price - reservation.refund_amount
  reservation.save!
end

# canceled and no cancel fee reservations of guest
2.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: guest.id,
    start_date: 7.days.ago,
    end_date: Faker::Date.between(from: 5.days.ago, to: 3.days.from_now),
    workflow_state: :canceled,
    price: Faker::Number.within(range: 10..30) *1000,
    paid_at: 13.days.ago,
    canceled_at: 14.days.ago,
    stripe_charge_id: Faker::Number.within(range: 131..140),
    stripe_refund_id: Faker::Number.within(range: 110..120),
    cancel_fee: 0
  )
end

# approved reservations of user
5.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: user.id,
    start_date: Faker::Date.between(from: 7.days.ago, to: 5.days.ago),
    end_date: 3.days.ago,
    workflow_state: :approved,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: 2.days.ago,
    canceled_at: nil,
    stripe_charge_id: Faker::Number.within(range: 150..160),
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# requested reservations of user
3.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: user.id,
    start_date: Faker::Date.between(from: 7.days.ago, to: 5.days.ago),
    end_date: Faker::Date.between(from: 3.days.ago, to: 5.days.from_now),
    workflow_state: :requested,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: nil,
    canceled_at: nil,
    stripe_charge_id: nil,
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# declined reservations of user
1.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: user.id,
    start_date: Faker::Date.forward(days: 7),
    end_date: Faker::Date.between(from: 7.days.from_now, to: 12.days.from_now),
    workflow_state: :declined,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: nil,
    canceled_at: nil,
    stripe_charge_id: nil,
    stripe_refund_id: nil,
    cancel_fee: 0
  )
end

# canceled and have cancel fee reservations of user
2.times do |i|
  post = Post.published.sample
  reservation = post.reservations.create!(
    user_id: user.id,
    start_date: 10.days.ago,
    end_date: Faker::Date.between(from: 5.days.ago, to: 3.days.from_now),
    workflow_state: :canceled,
    price: Faker::Number.within(range: 5..30) *1000,
    paid_at: 9.days.ago,
    canceled_at: 10.days.ago,
    stripe_charge_id: Faker::Number.within(range: 161..170),
    stripe_refund_id: nil,
    refund_amount: 5000
  )
  reservation.cancel_fee = reservation.price - reservation.refund_amount
  reservation.save!
end

# canceled and no cancel fee reservations of user
2.times do |i|
  post = Post.published.sample
  post.reservations.create!(
    user_id: user.id,
    start_date: 7.days.ago,
    end_date: Faker::Date.between(from: 5.days.ago, to: 3.days.from_now),
    workflow_state: :canceled,
    price: Faker::Number.within(range: 10..30) *1000,
    paid_at: 13.days.ago,
    canceled_at: 14.days.ago,
    stripe_charge_id: Faker::Number.within(range: 171..180),
    stripe_refund_id: Faker::Number.within(range: 130..140),
    cancel_fee: 0
  )
end

puts "Created reservation..."
