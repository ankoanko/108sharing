require "rails_helper"
require "rake"

describe "rake task admin" do
  before(:all) do
    @rake = Rake::Application.new
    Rake.application = @rake
    Rake.application.rake_require "tasks/admin"
    Rake::Task.define_task(:environment)
  end

  describe "admin:new" do
    let(:task) { "admin:new" }
    let(:args) { { username: "admin", email: "admin@example.com", password: "password" } }
    it "is succeed." do
      expect { @rake[task].execute(args).to change { User.count }.by 1 }
    end
  end
end
