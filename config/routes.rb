Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 🔐 Authentication
      post 'signup', to: 'auth#signup'
      post 'login', to: 'auth#login'
      get 'profile', to: 'auth#profile'

      # 🏢 Companies
      resources :companies, only: [:index, :show, :create]

      # 💸 Trades
      resources :users, only: [] do
        resources :trades, only: [:create]
      end
    end
  end
end
