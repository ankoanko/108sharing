require "rails_helper"

RSpec.describe UserPolicy, type: :policy do
  subject { UserPolicy.new(user, user_record) }

  let(:user) { build(:user) }
  let(:user_record) { user }

  context "for a visitor" do
    let(:user) { nil }

    it { should authorize(:show) }
    it { should_not authorize(:edit) }
    it { should_not authorize(:profile) }
    it { should_not authorize(:update) }
    it { should_not authorize(:cards) }
  end

  context "for an user" do
    it { should authorize(:show) }
    it { should authorize(:edit) }
    it { should authorize(:profile) }
    it { should authorize(:update) }
    it { should authorize(:cards) }
  end
end
