module System
  module SessionHelpers
    def sing_up_with(username, email, passsword)
      visit new_user_registration_path
      fill_in "Username", with: username
      fill_in "Email", with: email
      fill_in "Password", with: passsword
      click_button "Sign up"
    end

    def signin(email, password)
      visit new_user_session_path
      fill_in "Email", with: email
      fill_in "Password", with: password
      click_button "Log in"
    end

    def signin_with_twitter
      visit new_user_session_path
      click_link "Sign in with Twitter"
    end

    def signin_with_facebook
      visit new_user_session_path
      click_link "Sign in with Facebook"
    end

    def logout_session
      find(".navbar-link").hover
      signout_link = find(:xpath, "//a[contains(@href,'/users/sign_out')]", visible: false)
      signout_link.click
    end

    def open_settings
      find(".navbar-link").hover
      settings_link = find(:xpath, "//a[contains(@href,'/users/settings')]", visible: false)
      settings_link.click
    end
  end
end
