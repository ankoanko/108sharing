class StripeEvent::AccountHandler
  def call(event)
    # event.class       => Stripe::Event
    # event.type        => "charge.failed"
    # event.data.object => #<Stripe::Charge:0x3fcb34c115f8>

    method = "#{handle_} #{event.type.tr(".", "_")}"
    self.send method, event
  rescue JSON::ParserError
    # handle the json parsing error here
    raise # re-raise the exception to return a 500 error to stripe
    #  rescue NoMethodError
    # code to run when handling an unknown event

    # logger
    # update user
    # create activity
    # error handling
  end

  def handle_account_updated(event)
    return false unless (stripe_account = event.data.object)
    return false unless (user = User.find_by(stripe_account_id: stripe_account.id))

    # requirements = stripe_account.requirements
    # requirements.currently_due
    # requirements.disabled_reason
    # stripe_account.payouts_enabled

    user.check_stripe_verification(stripe_account)
  end
end
