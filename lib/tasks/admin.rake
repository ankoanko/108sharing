namespace :admin do
  desc "Create a new admin user"
  task :new, [:username, :email, :password] => :environment do |_task, args|
    puts "creating admin user #{args[:username]} #{args[:email]}, password #{args[:password]}"
    User.create!(
      username: args[:username],
      role: "admin",
      email: args[:email],
      password: args[:password],
      password_confirmation: args[:password],
      confirmed_at: Time.current,
    )
  end
end
