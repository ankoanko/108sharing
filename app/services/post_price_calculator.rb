class PostPriceCalculator
  def initialize(post, params)
    @post = post
    @start_date = Date.parse(params[:start_date])
    @end_date = Date.parse(params[:end_date]) - 1.day
  end

  def daily_price_days
    @post.calendars.where(
      "day BETWEEN ? AND ? AND daily_price IS NOT NULL",
      @start_date, @end_date
    )
  end

  def default_price_days
    days = (@start_date..@end_date).count
    days - daily_price_days.count
  end

  def calc_by_default_price
    @post.price.to_i * default_price_days
  end

  def calc_by_daily_price
    daily_price_days.map(&:daily_price).sum
  end

  def process!
    calc_by_default_price + calc_by_daily_price
  end
end
