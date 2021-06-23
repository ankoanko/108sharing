class ContactNotiferJob < ApplicationJob
  queue_as :mailers

  def perform(contact_id)
    @contact = Contact.find contact_id
    ContactMailer.notify(@contact).deliver_now
  end
end
