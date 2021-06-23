module Notifiable
  def title
    raise NotImplementError
  end

  def activity_path
    raise NotImplementError
  end

  def notify_condition?
    true
    # user.enable_email?
  end
end
