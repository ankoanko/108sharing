require "rails_helper"

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  it "has a valid factory" do
    expect(create(:user)).to be_valid
  end

  describe "associations" do
    it { is_expected.to have_one(:card) }
    it { is_expected.to have_one(:identification) }
    it { is_expected.to have_many(:social_profiles) }
    it { is_expected.to have_many(:posts) }
    it { is_expected.to have_many(:notifications) }
    it { is_expected.to have_many(:conversation_users) }
    it { is_expected.to have_many(:conversations) }
    it { is_expected.to have_many(:reservations) }
    it { is_expected.to have_many(:reviews) }
  end

  describe "delegate" do
    it { is_expected.to delegate_method(:workflow_state).to(:identification).with_prefix(true) }
  end

  # describe "email address with mixed case" do
  #   let(:user){create(:user)}
  #   let(:mixed_case_email) { "Foo@ExAMPle.CoM"}

  #   it "should be saved as all lower-case" do
  #     user.email = mixed_case_email
  #     user.save
  #     expect(user.reload.email).to eq mixed_case_email.downcase
  #   end
  # end

  describe "stripe" do
    describe "stripe_customer" do
      let(:token) { StripeMock.create_test_helper.generate_card_token }

      before { StripeMock.start }

      after { StripeMock.stop }

      context "when stripe customer id not present" do
        before do
          user.update_column(:stripe_customer_id, nil)
        end

        it "returns customer" do
          expect(user.find_or_create_stripe_customer).to be_present
          expect(user.find_or_create_stripe_customer.id).to eq Stripe::Customer.list.data.first.id
        end
      end

      context "when stripe customer id present" do
        let(:customer) { Stripe::Customer.create(email: user.email) }
        before do
          user.update_column(:stripe_customer_id, customer.id)
        end

        it "returns customer" do
          expect(user.find_or_create_stripe_customer.id).to eq(customer.id)
        end
      end

      # rubocop:disable RSpec/NestedGroups
      describe "create_or_update_stripe_default_card" do
        let(:token2) { StripeMock.create_test_helper.generate_card_token }

        context "when stripe customer id not present" do
          xit "creates customer" do
            customer = user.find_or_create_stripe_customer
            card = user.create_or_update_stripe_default_card(token)
            expect(user.card.stripe_card_id).to eq customer.default_source
          end
        end

        context "when stripe customer id present" do
          subject { user.create_or_update_stripe_default_card(token2) }

          let(:customer) { Stripe::Customer.create(source: token, email: user.email) }
          before do
            customer = user.find_or_create_stripe_customer
            card = user.create_or_update_stripe_default_card(token)
          end

          xit "creates customer" do
            expect { subject }.to change(user.card, :stripe_card_id)
          end
        end
      end
      # rubocop:enable RSpec/NestedGroups
    end
  end
end

# == Schema Information
#
# Table name: users
#
#  id                         :bigint(8)        not null, primary key
#  bio                        :text
#  birthday                   :date
#  confirmation_sent_at       :datetime
#  confirmation_token         :string
#  confirmed_at               :datetime
#  current_sign_in_at         :datetime
#  current_sign_in_ip         :inet
#  email                      :string           default(""), not null
#  email_exists               :boolean          default(TRUE)
#  enable_email               :boolean          default(TRUE)
#  encrypted_password         :string           default(""), not null
#  failed_attempts            :integer          default(0), not null
#  first_name                 :string
#  first_name_kana            :string
#  fullname                   :string
#  gender                     :integer          default("female")
#  last_name                  :string
#  last_name_kana             :string
#  last_sign_in_at            :datetime
#  last_sign_in_ip            :inet
#  locked_at                  :datetime
#  phone                      :string
#  posts_count                :integer          default(0)
#  published                  :boolean          default(TRUE)
#  remember_created_at        :datetime
#  reset_password_sent_at     :datetime
#  reset_password_token       :string
#  sign_in_count              :integer          default(0), not null
#  slug                       :string
#  suspended                  :boolean          default(FALSE)
#  unconfirmed_email          :string
#  unlock_token               :string
#  unread_messages_count      :integer          default(0)
#  unread_notifications_count :integer          default(0)
#  username                   :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  stripe_account_id          :string
#  stripe_customer_id         :string
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
