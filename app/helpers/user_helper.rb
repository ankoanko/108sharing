module UserHelper
  def user_avatar(user)
    return unless user

    if user.avatar.attached?
      image_tag user.avatar, class: "c-icon--user"
    else
      image_tag "/images/no-avatar.svg", class: "c-icon--user"
    end
  end
end
