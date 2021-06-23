class Form::CreateCollectionCalendar
  include ActiveModel::Model

  attr_reader :calendar_attributes, :post
  attr_accessor :calendars

  def initialize(post, attributes = {})
    @post = post
    super attributes
  end

  def calendar_attributes=(attributes)
    self.calendars = attributes.map do |calendar|
      post.calendars.find_or_initialize_by(post_id: @post.id, day: calendar[:day]).tap do |cal|
        cal.assign_attributes(calendar)
      end
    end
  end

  def valid?
    valid_calendars = calendars(&:valid?).all?
    super && valid_calendars
  end

  def save
    return false unless valid?

    Calendar.transaction do
      calendars.each(&:save!)
    end
  end

  def save!
    return self if save

    raise ActiveRecord::RecordInvalid(self)
  end
end

# create
# @post = Post.first
# calendar_bulk_form_params =
# { calendar_attributes: [
#   { blocked: true, reserved: true, daily_price: 8000, day: Date.current },
#   { blocked: true, reserved: true, daily_price: 8000, day: Date.current + 1.day }
# ] }

# create_or_update
# @post = Post.first
# calendar_bulk_form_params =
# { calendar_attributes: [
#   { blocked: false, reserved: true, daily_price: 3000, day: Date.current },
#   { blocked: true, reserved: false, daily_price: 4000, day: Date.current + 1.day },
#   { blocked: true, reserved: false, daily_price: 6000, day: Date.current + 2.day },
#   { blocked: true, reserved: false, daily_price: 7000, day: Date.current + 3.day },
#   { blocked: true, reserved: false, daily_price: 10000, day: Date.current + 4.day }
# ] }
# @form = Form::CreateBulkCalendar.new(@post, calendar_bulk_form_params)
