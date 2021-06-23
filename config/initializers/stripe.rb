Stripe.api_key = ENV["STRIPE_SECRET_KEY"]
StripeEvent.signing_secret = ENV['STRIPE_SIGNING_SECRET']

StripeEvent.configure do |events|
  events.subscribe 'account.', StripeEvent::AccountHandler.new
  events.subscribe 'payout.', StripeEvent::PayoutHandler.new

  events.all do |event|
    # Handle all event types - logging, etc.
  end
end

StripeEvent.event_filter = lambda do |event|
  #return nil if Rails.env.production? && !event.livemode
  event
end
