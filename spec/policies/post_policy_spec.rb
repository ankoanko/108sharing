require "rails_helper"

describe PostPolicy, type: :policy do
  subject { PostPolicy.new(user, post) }

  let(:author) { build(:user) }
  let(:other_user) { build(:user) }
  let(:admin_user) { build(:user, :admin) }
  let(:post) { build(:post, user: author) }

  context "for a visitor" do
    let(:user) { nil }

    it { should     authorize(:show)    }
    it { should_not authorize(:create)  }
    it { should_not authorize(:new)     }
    it { should_not authorize(:update)  }
    it { should_not authorize(:edit)    }
    it { should_not authorize(:destroy) }
    it { should_not authorize(:publish) }
  end

  context "for an author" do
    let(:user) { author }

    it { should authorize(:show)    }
    it { should authorize(:create)  }
    it { should authorize(:new)     }
    it { should authorize(:update)  }
    it { should authorize(:edit)    }
    it { should authorize(:destroy) }
    it { should authorize(:publish) }
  end

  context "for an other user" do
    let(:user) { other_user }

    it { should     authorize(:show)    }
    it { should_not authorize(:update)  }
    it { should_not authorize(:edit)    }
    it { should_not authorize(:destroy) }
    it { should_not authorize(:publish) }
  end

  context "for an admin user" do
    let(:user) { admin_user }

    it { should authorize(:show)    }
    it { should authorize(:create)  }
    it { should authorize(:new)     }
    it { should authorize(:update)  }
    it { should authorize(:edit)    }
    it { should authorize(:destroy) }
    it { should authorize(:publish) }
  end
end
