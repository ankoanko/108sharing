require "rails_helper"

describe "Signin", type: :system do
  let!(:user) { create(:user) }
  # before { @button = I18n.t('generic.login') }

  it "user sign in with valid params" do
    visit "/users/sign_in?locale=en"
    expect(page).to have_content("Login")

    within("form") do
      fill_in("email", with: user.email)
      fill_in("password", with: user.password)
      click_button("Login")
    end
    expect(current_path).to match(root_path)

    # TODO: FlashやNotice対応で調整する
    # expect(page).to have_content('ログインしました。')
  end

  it "user sign in with invalid params" do
    visit "/users/sign_in?locale=en"

    within("form") do
      fill_in("email", with: user.email)
      fill_in("password", with: "invalidPassword")
      click_button("Login")
    end
    expect(page).to have_current_path "/users/sign_in?locale=en"
    expect(page).to have_content("Invalid mail or password")
  end
end
