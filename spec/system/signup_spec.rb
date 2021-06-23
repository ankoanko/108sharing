require "rails_helper"

describe "Signup", type: :system do
  # before { @button = I18n.t('generic.signup') }

  xit "user sign up with valid params" do
    visit "/users/sign_up?locale=en"
    expect(page).to have_button("Signup")

    within("form") do
      fill_in("username", with: "username1")
      fill_in("email", with: "test@example.com")
      fill_in("password", with: "password")
      click_button("Create new account")
    end
    expect(current_path).to match(root_path)
    # expect(page).to have_current_path root_path

    # expect(page).to have_content 'Welcome! You have signed up successfully.'
  end

  xit "user sign up with invalid params" do
    visit "/users/sign_up?locale=en"

    within("form") do
      fill_in("username", with: "username2")
      fill_in("email", with: "test@example.com")
      fill_in("password", with: "pass")
      click_button("Create new account")
    end
    # expect(page).to have_content(/Password is too short/)
    expect(page).to have_current_path "/users/sign_up?locale=en"
  end
end
