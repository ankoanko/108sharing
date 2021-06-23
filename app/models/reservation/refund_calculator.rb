class Reservation::RefundCalculator
  attr_reader :reservation, :start_date

  def initialize(reservation)
    @reservation = reservation
    @start_date = reservation.start_date
  end

  def amount
    if reservation.approved?
      (reservation.price * rate).to_i
    else
      reservation.price
    end
  end

  def cancel_fee
    reservation.price - amount
  end

  def rate
    if more_than_two_weeks?
      1.0
    elsif more_than_one_week?
      0.9
    elsif more_than_three_days?
      0.7
    elsif more_than_one_day?
      0.5
    elsif the_day_before?
      0.2
    elsif the_day_after?
      0
    end
  end

  private

  def more_than_two_weeks?
    reservation.start_date > 2.weeks.from_now.to_date
  end

  def more_than_one_week?
    reservation.start_date > 1.weeks.from_now.to_date
  end

  def more_than_three_days?
    reservation.start_date > 3.days.from_now.to_date
  end

  def more_than_one_day?
    reservation.start_date > 1.days.from_now.to_date
  end

  def the_day_before?
    reservation.start_date == 1.days.from_now.to_date
  end

  def the_day_after?
    reservation.start_date <= Date.current.to_date
  end
end
