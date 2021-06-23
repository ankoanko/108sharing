class DeleteColoumAvailableToCalendar < ActiveRecord::Migration[5.2]
  def change
    remove_column :calendars, :available
  end
end
