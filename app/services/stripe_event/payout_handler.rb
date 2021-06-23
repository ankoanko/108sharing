class StripeEvent::PayoutHandler
  # rubocop:disable Style/StringConcatenation
  def call(event)
    # event.class       => Stripe::Event
    # event.type        => "charge.failed"
    # event.data.object => #<Stripe::Charge:0x3fcb34c115f8>

    method = "handle_" + event.type.tr(".", "_")
    self.send method, event
  rescue JSON::ParserError
    # handle the json parsing error here
    raise # re-raise the exception to return a 500 error to stripe
    # rescue NoMethodError
    # code to run when handling an unknown event

    # logger
    # update user
    # create activity
    # error handling
  end
  # rubocop:enable Style/StringConcatenation

  def handle_payout_failed(event)
    return false unless (stripe_payout = event.data.object)
    return false unless (payout = Payout.find_by(stripe_payout_id: stripe_payout.id))

    payout.update_by_remote(stripe_payout)
  end

  def handle_payout_paid(event)
    return false unless (stripe_payout = event.data.object)
    return false unless (payout = Payout.find_by(stripe_payout_id: stripe_payout.id))

    payout.update_by_remote(stripe_payout)
  end
end
