Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 🔐 Authentication
      post 'signup', to: 'auth#signup'
      post 'login', to: 'auth#login'
      get 'profile', to: 'auth#profile'
      put 'auth/update_profile', to: 'auth#update_profile'
      #get 'auth/google_oauth2/callback', to: 'auth#google_oauth2_callback'
      post 'password/forgot', to: 'passwords#forgot'
      put 'password/reset', to: 'passwords#reset'

      # 🏢 Companies
      resources :companies, only: [:index, :show, :create, :update, :destroy] do
        #get :price_history, on: :member  # 👈 Historical prices endpoint
        get :prediction, on: :member
      end
      # 📈 Stock Price Histories (Admin only)
      resources :stock_price_histories, only: [:create]  # 👈 To record new price/prediction
      resources :stock_predictions, only: [:create]


      # 💸 Trades
      resources :companies, only: [] do
        resources :users, only: [] do
          resources :trades, only: [:create]
        end 
      end

      # 🛡️ Devise (password controller override)
      devise_for :users, controllers: {
        passwords: 'api/v1/passwords'
      }

    end
  end
end