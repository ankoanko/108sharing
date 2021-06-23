module API
  class ContactsController < API::ApplicationController
    def create
      contact = Contact.new(contact_params)

      if contact.save
        ContactMailer.notify_to_inquirer(contact).deliver_now
        render json: ContactSerializer.serialize(contact)
      else
        render json: { errors: contact.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    private

    def contact_params
      params.require(:contact).permit(:title, :name, :email, :subject, :body, :status, :note, :user_id)
    end
  end
end
