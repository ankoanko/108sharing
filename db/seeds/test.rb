puts "Clearing old data..."
%w(Review Conversation ConversationUser Calendar Reservation Card PostImage Post User).map{ |klass| klass.to_s.classify.safe_constantize.delete_all }

puts "Creating master..."

puts "Creating role..."
admin_role, host_role, guest_role = %w[admin host guest].map { |name| Role.create!(name: name) }
puts "Created role..."
