module HasGoogleCalendar
  protected

  def enable_google_calendar?
    Settings&.google&.calendar&.client_id.present?
  end
end
