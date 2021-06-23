require 'sidekiq/web'

Rails.application.routes.draw do

  # admin
  namespace :admin do
    namespace :api do
      resource :setting, only: %i(update), controller: :setting
      resources :announcements, only: %i(create update destroy)
      resources :posts, only: %i(create update destroy)
      resources :categories, only: %i(create update destroy)
      resources :tags, only: %i(create update destroy)
      resources :users, only: %i(create update destroy)
      resources :identifications, only: %i() do
        member do
          put :approve
          put :decline
        end
      end
    end
    get '/',  to: 'dashboard#index'
    resources :announcements, only: %i(index new edit)
    resources :categories, only: %i(index new edit)
    resources :tags, only: %i(index new edit)
    resources :users, only: %i(index new edit)
    resources :posts, only: %i(index)
    resource :settings, only: %i(show edit)
    resources :contacts, only: %i(index)
    resources :identifications, only: %i(index)
    resources :reservations, only: %i(index)
  end

  authenticate :user, ->(u) { u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end

  root to: 'static_pages#top'
  get 'social_profiles/destroy'
  resources :users, only: :show, path: '/user'

  resources :posts, only: %i(index new edit show) do
    collection do
      get :search
    end
  end

  resources :favorites, only: %i(index)
  resources :contacts, only: %i(new)
  resources :host_reservations, only: %i(index)
  resources :receipts, only: %i(show)
  resources :reservations, only: %i(index show)

  devise_for :users,
             skip: :omniauth_callbacks,
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations',
               passwords: 'users/passwords',
               confirmations: 'users/confirmations'
             }

  scope :settings, as: 'settings' do
    get '/profile', to: 'users#profile'
    resource :card, only: %i(show), controller: :cards
    resource :identification, only: %i(show), controller: :identifications
    resource :bank_account, only: %i(show)
    resources :payments, only: %i(index)
    resource :setting, path: 'notification'
    get :payment_history, to: 'static_pages#payment_history'
    get :business_registration, to: 'static_pages#business_registration'
  end

  # static pages
  get 'top', to: 'static_pages#top'
  get 'terms_of_use', to: 'static_pages#terms_of_use'
  get 'policy', to: 'static_pages#policy'

  concern :reportable do
    resources :violation_reports, only: %i(create)
  end

  namespace :api do
    resources :posts, only: %i(create update destroy), concerns: :reportable do
      member do
        put :toggle_like
        put :publish
        put :close
        get :calculate
      end
      collection do
        get :search
      end
      resources :reviews, only: %i(new create)
      resources :collection_calendars, only: %i(create)
      resources :calendars, only: %i(index)
    end

    resources :users, only: %i(update), concerns: :reportable
    resource :user, only: %i(update)
    resources :users, only: [] do
      member do
        put :toggle_like
      end
    end
    resources :bank_accounts, only: %i(create update)
    resources :payouts, only: %i(create)
    resource :identity_verification, only: %i(create)
    resources :social_profiles, only: %i(destroy), param: :provider
    resource :card, only: %i(create destroy show), controller: :card
    resources :post_images, only: %i(create update destroy)
    resources :favorites, only: %i(index)
    resources :related_posts, only: %i(show)
    resources :notifications, only: %i(index update)
    resources :reservations, only: %i(create) do
      member do
        put :approve
        put :decline
        put :cancel
        get :refund_amount
      end
      collection do
        get :search
      end
    end
    resources :receipts, only: %i(create)
    resources :identification_images, only: %i(create)
    resources :messages, only: %i(create)
    resources :reviews, only: %i(create)
    resources :review_replies, only: %i(create)
    resources :contacts, only: %i(create)

    namespace :v1 do
      get 'lb/health'
    end
  end

  resource :password, only: %i(update), controller: :password
  devise_for :users,
             skip: [
               :session,
               :password,
               :registration,
               :confirmation
             ],
             controllers: {
               omniauth_callbacks: 'users/omniauth_callbacks'
             }

  mount StripeEvent::Engine, at: '/webhooks/stripe'

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: '/letter_opener'
  end
end

# == Route Map
#
#                                Prefix Verb     URI Pattern                                                                              Controller#Action
#                     admin_api_setting PATCH    /admin/api/setting(.:format)                                                             admin/api/setting#update
#                                       PUT      /admin/api/setting(.:format)                                                             admin/api/setting#update
#               admin_api_announcements POST     /admin/api/announcements(.:format)                                                       admin/api/announcements#create
#                admin_api_announcement PATCH    /admin/api/announcements/:id(.:format)                                                   admin/api/announcements#update
#                                       PUT      /admin/api/announcements/:id(.:format)                                                   admin/api/announcements#update
#                                       DELETE   /admin/api/announcements/:id(.:format)                                                   admin/api/announcements#destroy
#                       admin_api_posts POST     /admin/api/posts(.:format)                                                               admin/api/posts#create
#                        admin_api_post PATCH    /admin/api/posts/:id(.:format)                                                           admin/api/posts#update
#                                       PUT      /admin/api/posts/:id(.:format)                                                           admin/api/posts#update
#                                       DELETE   /admin/api/posts/:id(.:format)                                                           admin/api/posts#destroy
#                  admin_api_categories POST     /admin/api/categories(.:format)                                                          admin/api/categories#create
#                    admin_api_category PATCH    /admin/api/categories/:id(.:format)                                                      admin/api/categories#update
#                                       PUT      /admin/api/categories/:id(.:format)                                                      admin/api/categories#update
#                                       DELETE   /admin/api/categories/:id(.:format)                                                      admin/api/categories#destroy
#                        admin_api_tags POST     /admin/api/tags(.:format)                                                                admin/api/tags#create
#                         admin_api_tag PATCH    /admin/api/tags/:id(.:format)                                                            admin/api/tags#update
#                                       PUT      /admin/api/tags/:id(.:format)                                                            admin/api/tags#update
#                                       DELETE   /admin/api/tags/:id(.:format)                                                            admin/api/tags#destroy
#                       admin_api_users POST     /admin/api/users(.:format)                                                               admin/api/users#create
#                        admin_api_user PATCH    /admin/api/users/:id(.:format)                                                           admin/api/users#update
#                                       PUT      /admin/api/users/:id(.:format)                                                           admin/api/users#update
#                                       DELETE   /admin/api/users/:id(.:format)                                                           admin/api/users#destroy
#      approve_admin_api_identification PUT      /admin/api/identifications/:id/approve(.:format)                                         admin/api/identifications#approve
#      decline_admin_api_identification PUT      /admin/api/identifications/:id/decline(.:format)                                         admin/api/identifications#decline
#                                 admin GET      /admin(.:format)                                                                         admin/dashboard#index
#                   admin_announcements GET      /admin/announcements(.:format)                                                           admin/announcements#index
#                new_admin_announcement GET      /admin/announcements/new(.:format)                                                       admin/announcements#new
#               edit_admin_announcement GET      /admin/announcements/:id/edit(.:format)                                                  admin/announcements#edit
#                      admin_categories GET      /admin/categories(.:format)                                                              admin/categories#index
#                    new_admin_category GET      /admin/categories/new(.:format)                                                          admin/categories#new
#                   edit_admin_category GET      /admin/categories/:id/edit(.:format)                                                     admin/categories#edit
#                            admin_tags GET      /admin/tags(.:format)                                                                    admin/tags#index
#                         new_admin_tag GET      /admin/tags/new(.:format)                                                                admin/tags#new
#                        edit_admin_tag GET      /admin/tags/:id/edit(.:format)                                                           admin/tags#edit
#                           admin_users GET      /admin/users(.:format)                                                                   admin/users#index
#                        new_admin_user GET      /admin/users/new(.:format)                                                               admin/users#new
#                       edit_admin_user GET      /admin/users/:id/edit(.:format)                                                          admin/users#edit
#                           admin_posts GET      /admin/posts(.:format)                                                                   admin/posts#index
#                   edit_admin_settings GET      /admin/settings/edit(.:format)                                                           admin/settings#edit
#                        admin_settings GET      /admin/settings(.:format)                                                                admin/settings#show
#                        admin_contacts GET      /admin/contacts(.:format)                                                                admin/contacts#index
#                 admin_identifications GET      /admin/identifications(.:format)                                                         admin/identifications#index
#                    admin_reservations GET      /admin/reservations(.:format)                                                            admin/reservations#index
#                           sidekiq_web          /sidekiq                                                                                 Sidekiq::Web
#                                  root GET      /                                                                                        static_pages#top
#               social_profiles_destroy GET      /social_profiles/destroy(.:format)                                                       social_profiles#destroy
#                                  user GET      /user/:id(.:format)                                                                      users#show
#                          search_posts GET      /posts/search(.:format)                                                                  posts#search
#                                 posts GET      /posts(.:format)                                                                         posts#index
#                              new_post GET      /posts/new(.:format)                                                                     posts#new
#                             edit_post GET      /posts/:id/edit(.:format)                                                                posts#edit
#                                  post GET      /posts/:id(.:format)                                                                     posts#show
#                             favorites GET      /favorites(.:format)                                                                     favorites#index
#                           new_contact GET      /contacts/new(.:format)                                                                  contacts#new
#                     host_reservations GET      /host_reservations(.:format)                                                             host_reservations#index
#                               receipt GET      /receipts/:id(.:format)                                                                  receipts#show
#                          reservations GET      /reservations(.:format)                                                                  reservations#index
#                           reservation GET      /reservations/:id(.:format)                                                              reservations#show
#                      new_user_session GET      /users/sign_in(.:format)                                                                 users/sessions#new
#                          user_session POST     /users/sign_in(.:format)                                                                 users/sessions#create
#                  destroy_user_session DELETE   /users/sign_out(.:format)                                                                users/sessions#destroy
#                     new_user_password GET      /users/password/new(.:format)                                                            users/passwords#new
#                    edit_user_password GET      /users/password/edit(.:format)                                                           users/passwords#edit
#                         user_password PATCH    /users/password(.:format)                                                                users/passwords#update
#                                       PUT      /users/password(.:format)                                                                users/passwords#update
#                                       POST     /users/password(.:format)                                                                users/passwords#create
#              cancel_user_registration GET      /users/cancel(.:format)                                                                  users/registrations#cancel
#                 new_user_registration GET      /users/sign_up(.:format)                                                                 users/registrations#new
#                edit_user_registration GET      /users/edit(.:format)                                                                    users/registrations#edit
#                     user_registration PATCH    /users(.:format)                                                                         users/registrations#update
#                                       PUT      /users(.:format)                                                                         users/registrations#update
#                                       DELETE   /users(.:format)                                                                         users/registrations#destroy
#                                       POST     /users(.:format)                                                                         users/registrations#create
#                 new_user_confirmation GET      /users/confirmation/new(.:format)                                                        users/confirmations#new
#                     user_confirmation GET      /users/confirmation(.:format)                                                            users/confirmations#show
#                                       POST     /users/confirmation(.:format)                                                            users/confirmations#create
#                      settings_profile GET      /settings/profile(.:format)                                                              users#profile
#                         settings_card GET      /settings/card(.:format)                                                                 cards#show
#               settings_identification GET      /settings/identification(.:format)                                                       identifications#show
#                 settings_bank_account GET      /settings/bank_account(.:format)                                                         bank_accounts#show
#                     settings_payments GET      /settings/payments(.:format)                                                             payments#index
#                  new_settings_setting GET      /settings/notification/new(.:format)                                                     settings#new
#                 edit_settings_setting GET      /settings/notification/edit(.:format)                                                    settings#edit
#                      settings_setting GET      /settings/notification(.:format)                                                         settings#show
#                                       PATCH    /settings/notification(.:format)                                                         settings#update
#                                       PUT      /settings/notification(.:format)                                                         settings#update
#                                       DELETE   /settings/notification(.:format)                                                         settings#destroy
#                                       POST     /settings/notification(.:format)                                                         settings#create
#              settings_payment_history GET      /settings/payment_history(.:format)                                                      static_pages#payment_history
#        settings_business_registration GET      /settings/business_registration(.:format)                                                static_pages#business_registration
#                                   top GET      /top(.:format)                                                                           static_pages#top
#                          terms_of_use GET      /terms_of_use(.:format)                                                                  static_pages#terms_of_use
#                                policy GET      /policy(.:format)                                                                        static_pages#policy
#                  toggle_like_api_post PUT      /api/posts/:id/toggle_like(.:format)                                                     api/posts#toggle_like
#                      publish_api_post PUT      /api/posts/:id/publish(.:format)                                                         api/posts#publish
#                        close_api_post PUT      /api/posts/:id/close(.:format)                                                           api/posts#close
#                    calculate_api_post GET      /api/posts/:id/calculate(.:format)                                                       api/posts#calculate
#                      search_api_posts GET      /api/posts/search(.:format)                                                              api/posts#search
#                      api_post_reviews POST     /api/posts/:post_id/reviews(.:format)                                                    api/reviews#create
#                   new_api_post_review GET      /api/posts/:post_id/reviews/new(.:format)                                                api/reviews#new
#         api_post_collection_calendars POST     /api/posts/:post_id/collection_calendars(.:format)                                       api/collection_calendars#create
#                    api_post_calendars GET      /api/posts/:post_id/calendars(.:format)                                                  api/calendars#index
#            api_post_violation_reports POST     /api/posts/:post_id/violation_reports(.:format)                                          api/violation_reports#create
#                             api_posts POST     /api/posts(.:format)                                                                     api/posts#create
#                              api_post PATCH    /api/posts/:id(.:format)                                                                 api/posts#update
#                                       PUT      /api/posts/:id(.:format)                                                                 api/posts#update
#                                       DELETE   /api/posts/:id(.:format)                                                                 api/posts#destroy
#            api_user_violation_reports POST     /api/users/:user_id/violation_reports(.:format)                                          api/violation_reports#create
#                              api_user PATCH    /api/users/:id(.:format)                                                                 api/users#update
#                                       PUT      /api/users/:id(.:format)                                                                 api/users#update
#                                       PATCH    /api/user(.:format)                                                                      api/users#update
#                                       PUT      /api/user(.:format)                                                                      api/users#update
#                  toggle_like_api_user PUT      /api/users/:id/toggle_like(.:format)                                                     api/users#toggle_like
#                     api_bank_accounts POST     /api/bank_accounts(.:format)                                                             api/bank_accounts#create
#                      api_bank_account PATCH    /api/bank_accounts/:id(.:format)                                                         api/bank_accounts#update
#                                       PUT      /api/bank_accounts/:id(.:format)                                                         api/bank_accounts#update
#                           api_payouts POST     /api/payouts(.:format)                                                                   api/payouts#create
#             api_identity_verification POST     /api/identity_verification(.:format)                                                     api/identity_verifications#create
#                    api_social_profile DELETE   /api/social_profiles/:provider(.:format)                                                 api/social_profiles#destroy
#                              api_card GET      /api/card(.:format)                                                                      api/card#show
#                                       DELETE   /api/card(.:format)                                                                      api/card#destroy
#                                       POST     /api/card(.:format)                                                                      api/card#create
#                       api_post_images POST     /api/post_images(.:format)                                                               api/post_images#create
#                        api_post_image PATCH    /api/post_images/:id(.:format)                                                           api/post_images#update
#                                       PUT      /api/post_images/:id(.:format)                                                           api/post_images#update
#                                       DELETE   /api/post_images/:id(.:format)                                                           api/post_images#destroy
#                         api_favorites GET      /api/favorites(.:format)                                                                 api/favorites#index
#                      api_related_post GET      /api/related_posts/:id(.:format)                                                         api/related_posts#show
#                     api_notifications GET      /api/notifications(.:format)                                                             api/notifications#index
#                      api_notification PATCH    /api/notifications/:id(.:format)                                                         api/notifications#update
#                                       PUT      /api/notifications/:id(.:format)                                                         api/notifications#update
#               approve_api_reservation PUT      /api/reservations/:id/approve(.:format)                                                  api/reservations#approve
#               decline_api_reservation PUT      /api/reservations/:id/decline(.:format)                                                  api/reservations#decline
#                cancel_api_reservation PUT      /api/reservations/:id/cancel(.:format)                                                   api/reservations#cancel
#         refund_amount_api_reservation GET      /api/reservations/:id/refund_amount(.:format)                                            api/reservations#refund_amount
#               search_api_reservations GET      /api/reservations/search(.:format)                                                       api/reservations#search
#                      api_reservations POST     /api/reservations(.:format)                                                              api/reservations#create
#                          api_receipts POST     /api/receipts(.:format)                                                                  api/receipts#create
#             api_identification_images POST     /api/identification_images(.:format)                                                     api/identification_images#create
#                          api_messages POST     /api/messages(.:format)                                                                  api/messages#create
#                           api_reviews POST     /api/reviews(.:format)                                                                   api/reviews#create
#                    api_review_replies POST     /api/review_replies(.:format)                                                            api/review_replies#create
#                          api_contacts POST     /api/contacts(.:format)                                                                  api/contacts#create
#                      api_v1_lb_health GET      /api/v1/lb/health(.:format)                                                              api/v1/lb#health
#                              password PATCH    /password(.:format)                                                                      password#update
#                                       PUT      /password(.:format)                                                                      password#update
#      user_facebook_omniauth_authorize GET|POST /users/auth/facebook(.:format)                                                           users/omniauth_callbacks#passthru
#       user_facebook_omniauth_callback GET|POST /users/auth/facebook/callback(.:format)                                                  users/omniauth_callbacks#facebook
#       user_twitter_omniauth_authorize GET|POST /users/auth/twitter(.:format)                                                            users/omniauth_callbacks#passthru
#        user_twitter_omniauth_callback GET|POST /users/auth/twitter/callback(.:format)                                                   users/omniauth_callbacks#twitter
# user_google_oauth2_omniauth_authorize GET|POST /users/auth/google_oauth2(.:format)                                                      users/omniauth_callbacks#passthru
#  user_google_oauth2_omniauth_callback GET|POST /users/auth/google_oauth2/callback(.:format)                                             users/omniauth_callbacks#google_oauth2
#                          stripe_event          /webhooks/stripe                                                                         StripeEvent::Engine
#                     letter_opener_web          /letter_opener                                                                           LetterOpenerWeb::Engine
#         rails_postmark_inbound_emails POST     /rails/action_mailbox/postmark/inbound_emails(.:format)                                  action_mailbox/ingresses/postmark/inbound_emails#create
#            rails_relay_inbound_emails POST     /rails/action_mailbox/relay/inbound_emails(.:format)                                     action_mailbox/ingresses/relay/inbound_emails#create
#         rails_sendgrid_inbound_emails POST     /rails/action_mailbox/sendgrid/inbound_emails(.:format)                                  action_mailbox/ingresses/sendgrid/inbound_emails#create
#   rails_mandrill_inbound_health_check GET      /rails/action_mailbox/mandrill/inbound_emails(.:format)                                  action_mailbox/ingresses/mandrill/inbound_emails#health_check
#         rails_mandrill_inbound_emails POST     /rails/action_mailbox/mandrill/inbound_emails(.:format)                                  action_mailbox/ingresses/mandrill/inbound_emails#create
#          rails_mailgun_inbound_emails POST     /rails/action_mailbox/mailgun/inbound_emails/mime(.:format)                              action_mailbox/ingresses/mailgun/inbound_emails#create
#        rails_conductor_inbound_emails GET      /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#index
#                                       POST     /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#create
#     new_rails_conductor_inbound_email GET      /rails/conductor/action_mailbox/inbound_emails/new(.:format)                             rails/conductor/action_mailbox/inbound_emails#new
#    edit_rails_conductor_inbound_email GET      /rails/conductor/action_mailbox/inbound_emails/:id/edit(.:format)                        rails/conductor/action_mailbox/inbound_emails#edit
#         rails_conductor_inbound_email GET      /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#show
#                                       PATCH    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
#                                       PUT      /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
#                                       DELETE   /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#destroy
# rails_conductor_inbound_email_reroute POST     /rails/conductor/action_mailbox/:inbound_email_id/reroute(.:format)                      rails/conductor/action_mailbox/reroutes#create
#                    rails_service_blob GET      /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
#             rails_blob_representation GET      /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
#                    rails_disk_service GET      /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
#             update_rails_disk_service PUT      /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
#                  rails_direct_uploads POST     /rails/active_storage/direct_uploads(.:format)                                           active_storage/direct_uploads#create
#
# Routes for StripeEvent::Engine:
#   root POST /           stripe_event/webhook#event
#
# Routes for LetterOpenerWeb::Engine:
# clear_letters DELETE /clear(.:format)                 letter_opener_web/letters#clear
# delete_letter DELETE /:id(.:format)                   letter_opener_web/letters#destroy
#       letters GET    /                                letter_opener_web/letters#index
#        letter GET    /:id(/:style)(.:format)          letter_opener_web/letters#show
#               GET    /:id/attachments/:file(.:format) letter_opener_web/letters#attachment
