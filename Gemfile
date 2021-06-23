# frozen_string_literal: true
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.2'
gem 'rails', '~> 6.0.3.6'

gem 'aasm'
gem 'active_storage_validations'
gem 'acts_as_list'
gem 'acts_as_votable', git: 'https://github.com/ryanto/acts_as_votable'
gem 'aws-sdk-s3', require: false
gem 'aws-sdk-rails'
gem 'bootsnap', '>= 1.1.0', require: false
gem 'chronic'
gem 'counter_culture'
gem 'devise'
gem 'devise-i18n'
gem 'diff-lcs', '~>1.4.4'
gem 'enum_help'
gem 'jsonapi-serializer'
gem 'foreman'
gem 'friendly_id'
gem 'hashie'
gem 'hiredis'
gem 'i18n-js'
gem 'impressionist'
gem 'kaminari'
gem 'meta-tags'
gem 'mini_magick'
gem 'omniauth'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
gem 'omniauth-stripe-connect'
gem 'omniauth-twitter'
gem 'paper_trail'
gem 'pg', '>= 0.18', '< 2.0'
gem 'public_activity'
gem 'puma', '~> 5.1', '>= 5.1.1'
gem 'pundit'
gem 'rails-settings-cached'
gem 'ransack'
gem 'react-rails'
gem 'sass-rails', '~> 6.0'
gem 'sidekiq'
gem 'sitemap_generator'
gem 'stripe'
gem 'stripe_event'
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'uglifier', '>= 1.3.0'
gem 'validate_url'
gem 'validates_email_format_of'
gem 'webpacker'
gem 'wicked_pdf'
gem 'wkhtmltopdf-binary'
gem 'faker'
gem 'image_processing', '~> 1.2'

group :development do
 gem 'listen', '~> 3.3'
 gem 'rails-erd', require: false
 gem 'web-console'
end

group :development, :test do
 gem 'annotate'
 gem 'better_errors'
 gem 'brakeman', require: false
 gem 'bullet'
 gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
 gem 'dotenv-rails'
 gem 'factory_bot_rails'
 gem 'guard'
 gem 'guard-rspec'
 gem 'i18n_generators'
 gem 'letter_opener'
 gem 'letter_opener_web'
 gem 'pry'
 gem 'pry-byebug'
 gem 'pry-rails'
 gem 'rspec-rails'
 gem 'rspec_junit_formatter'
 gem 'rubocop', '~> 1.6.0', require: false
 gem 'rubocop-automata'
 gem 'rubocop-rails', require: false
 gem 'rubocop-rspec', '~> 2.2.0'
 gem 'shoulda-matchers' 
 gem 'stripe-ruby-mock', '~> 3.0.1', require: 'stripe_mock'
 gem 'webmock'
end

group :test do
 gem 'capybara'
 gem 'capybara-screenshot'
 gem 'selenium-webdriver'
 gem 'simplecov', require: false
 gem 'webdrivers'
end

#group :production do
# dotenv指定では認識されないのでdirenvなどで指定する
# if ENV['ACTIVE_STORAGE_SERVICE'] == 'google'
   gem 'google-cloud-storage'
#  end
#end
