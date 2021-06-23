module Admin
  class ContactsController < Admin::BaseController
    include Pagination
    include SortableTable

    def index
      contacts = policy_scope(Contact).order("#{sort_column} #{sort_direction}")
      authorize contacts
      @contacts_json = json_pagination(contacts, ContactSerializer)
    end
  end
end
