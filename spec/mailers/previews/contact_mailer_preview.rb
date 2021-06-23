# Preview all emails at http://localhost:3000/rails/mailers/contact_mailer
class ContactMailerPreview < ActionMailer::Preview
  def notify
    contact = Contact.create!(name: "yamada taro", email: "quser@example.com", subject: "Just a subject test.", body: "Just a body test.")
    ContactMailer.notify(contact.id)
  end
end
