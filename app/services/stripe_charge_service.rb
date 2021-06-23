class StripeChargeService
  attr_reader :stripe_customer, :reservation

  def initialize(params)
    @user = params[:user]
    @source = params[:source]
    @reservation = params[:reservation]
    @reason = params[:reason]
    @refund_amount = params[:refund_amount]
    create_or_update_stripe_customer if @user.present?
  end

  def create_or_update_stripe_customer
    @stripe_customer = @user.find_or_create_stripe_customer
    return @stripe_customer if @source.nil?

    @user.create_or_update_stripe_default_card(@source)
    @stripe_customer
  end

  # rubocop:disable  Style/GuardClause
  def charge_customer
    @stripe_customer ||= @user.stripe_customer
    if @stripe_customer.default_source.present?
      Stripe::Charge.create(amount: reservation.price,
                            currency: "jpy",
                            customer: stripe_customer.id,
                            source: stripe_customer.default_source,
                            receipt_email: stripe_customer.email,
                            description: stripe_description,
                            metadata: stripe_metadata,
                            # destination: {
                            #   amount: (reservation.price * 0.8).floor,
                            #   account: reservation.post.user.try('stripe_account_id'),
                            # },
                            transfer_group: reservation.slug,
                            # on_behalf_of: reservation.post.user.stripe_account_id,
                            capture: false)
    end
  end
  # rubocop:enable  Style/GuardClause

  def capture_charge
    return unless reservation.stripe_charge_id

    stripe_charge = Stripe::Charge.retrieve(reservation.stripe_charge_id)
    Stripe::Charge.capture(stripe_charge.id)
  end

  def stripe_description
    "#{reservation.post.user.fullname} への #{reservation.post.name} に対するお支払い"
  end

  def stripe_statement_descriptor
    "Descriptor #{reservation.price}"
  end

  def stripe_metadata
    {
      year: Time.current.year,
      type: "108sharing",
    }
  end

  def refund_customer
    charge = Stripe::Charge.retrieve(reservation.stripe_charge_id)
    charge_params = {
      charge: charge.id,
      reason: "requested_by_customer",
      amount: @refund_amount,
      metadata: { reason: @reason },
    }

    # charge_params.merge!(amount: reservation.refund_amount)
    Stripe::Refund.create(charge_params)
  end

  def application_fee(amount)
    (amount * 0.05).ceil.to_i * 100
  end
end
