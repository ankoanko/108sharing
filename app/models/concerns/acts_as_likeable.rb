# 使ってない？
module ActsAsLikeable
  extend ActiveSupport::Concern

  included do
    has_many :likes, class_name: "Like", as: :likeable, dependent: :destroy
  end

  def liked?
    likes.any?
  end

  def liked_by?(user)
    likes.where(user: user).any?
  end

  # rubocop:disable Rails/FindBy
  def like_for(user)
    likes.where(user: user).first
  end
  # rubocop:enable Rails/FindBy

  def like!(user)
    likes.find_or_create_by!(user: user)
  end

  def unlike!(user)
    likes.where(user: user).destroy_all
    false
  end

  def toggle_like!(user)
    if liked_by?(user)
      unlike!(user)
    else
      like!(user)
    end
    # if !liked_by?(user)
    #   like!(user)
    # else
    #   unlike!(user)
    # end
  end
end
