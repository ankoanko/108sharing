module DeviseResponder
  protected

  def json_resource_errors
    {
      errors: resource.errors.full_messages,
    }
  end
end
