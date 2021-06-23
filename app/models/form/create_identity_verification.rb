class Form::CreateIdentityVerification
  include ActiveModel::Model

  attr_accessor :user, :identification, :identification_image, :address, :last_name, :last_name_kana, :first_name, :first_name_kana, :birthday, :gender, :phone
  attr_reader :identification_image_attributes, :address_attributes

  VALID_PHONE_REGEX = /\A(0{1}\d{1,4}-{0,1}\d{1,4}-{0,1}\d{4})\z/
  validates :last_name, :last_name_kana, :first_name, :first_name_kana, :birthday, :gender, :phone, :address, :identification_image, presence: true
  validates :phone, format: { with: VALID_PHONE_REGEX }

  def initialize(user, attributes = {})
    @user = user
    @identification = @user.identification || @user.build_identification
    super attributes
  end

  def identification_image_attributes=(attributes)
    @identification_image = IdentificationImage.new(attributes)
  end

  def address_attributes=(attributes)
    @address = user.address || user.build_address
    @address.attributes = attributes
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def save
    return false if invalid?

    ActiveRecord::Base.transaction do
      user.update!(
        last_name: last_name,
        last_name_kana: last_name_kana,
        first_name: first_name,
        first_name_kana: first_name_kana,
        birthday: birthday,
        gender: gender,
        phone: phone,
      )
      identification.save!
      identification.requested!
      identification_image.identification_id = identification.id
      identification_image.save!
      address.save!
    end

    true
  rescue ActiveRecord::StatementInvalid => e
    errors.add(:base, e.message)

    false
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def save!
    raise ActiveRecord::RecordInvalid if invalid?

    user.update!(
      last_name: last_name,
      last_name_kana: last_name_kana,
      first_name: first_name,
      first_name_kana: first_name_kana,
      birthday: birthday,
      gender: gender,
      phone: phone,
    )
    address.save!
    identification.save!
    identification.requested!
    identification_image.identification_id = identification.id
    identification_image.save!
  end
end
