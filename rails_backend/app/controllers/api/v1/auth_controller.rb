class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user!, except: [:signup,:login]
    
    def signup
  role = params[:role] == "admin" ? "admin" : "user"
  balance = params[:balance].presence || 10_000

  user = User.new(signup_params.merge(role: role, balance: balance))

  if user.save
    DataExporter.export_all
    render json: { message: 'User created successfully', user: user }, status: :created
  else
    Rails.logger.debug("User signup errors: #{user.errors.full_messages.join(', ')}")
    render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
  end
end


  
   def login
  user = User.find_by(email: params[:email])

  if user && user.valid_password?(params[:password])
    token = generate_jwt_token(user)
    render json: { message: 'Login successful', token: token }, status: :ok
  else
    render json: { errors: ['Invalid credentials'] }, status: :unauthorized
  end
end

  
    def profile
      render json: {
        message: 'User profile fetched successfully',
        user: {
          id: @current_user.id,
          first_name: @current_user.first_name,
          last_name: @current_user.last_name,
          email: @current_user.email,
          phone: @current_user.phone,
          role: @current_user.role,
          balance: @current_user.balance,
          trades: @current_user.trades.includes(:company).map do |trade|
            {
              trade_id: trade.id,
              company_name: trade.company.name,
              stock_quantity: trade.stock_quantity,
              price_per_stock: trade.price_per_stock,
              transaction_type: trade.transaction_type,
              total_value: trade.stock_quantity * trade.price_per_stock,
              created_at: trade.created_at
            }
          end
        }
      }, status: :ok
    end

    def update_profile
      if @current_user.update(profile_update_params)
        render json: { message: 'Profile updated successfully', user: @current_user }, status: :ok
      else
        render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def google_oauth2_callback
      code = params[:code]
      if code.blank?
        return render json: { error: "Authorization code not provided" }, status: :bad_request
      end
      # Exchange code for tokens
      token_response = Faraday.post("https://oauth2.googleapis.com/token") do |req|
        req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        req.body = URI.encode_www_form({

          code: code,
          client_id: ENV['GOOGLE_CLIENT_ID'],        # use env variables!
          client_secret: ENV['GOOGLE_CLIENT_SECRET'],
          redirect_uri: "http://localhost:3000/api/v1/auth/google_oauth2/callback",  # must match your registered URI
          grant_type: "authorization_code"
        })
      end
      if token_response.status != 200
        return render json: { error: "Failed to exchange code for token" }, status: :unauthorized
      end
      token_data = JSON.parse(token_response.body)
      id_token = token_data['id_token']


      # Validate ID token and get user info
      user_info_response = Faraday.get("https://oauth2.googleapis.com/tokeninfo?id_token=#{id_token}")
      user_info = JSON.parse(user_info_response.body)

      if user_info["email_verified"] != "true"
        return render json: { error: "Email not verified by Google" }, status: :unauthorized
      end

      # Find or create user
      user = User.find_or_initialize_by(email: user_info["email"])
      user.first_name ||= user_info["given_name"]
      user.last_name ||= user_info["family_name"]
      user.password ||= Devise.friendly_token[0, 20]
      user.role ||= "user"
      user.balance ||= 10_000
      user.save!

      jwt_token = generate_jwt_token(user)
      render json: { token: jwt_token, user: user }, status: :ok


      rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
    private
    def profile_update_params
      params.require(:user).permit(:first_name, :last_name, :email, :phone, :password, :password_confirmation)
    end

    private
  
    def generate_jwt_token(user)
      JWT.encode(
        { user_id: user.id, exp: 24.hours.from_now.to_i },
        Rails.application.credentials.dig(:jwt_secret_key) || Rails.application.secret_key_base
      )
    end
  
   
def signup_params
  # Permit params at root level (not nested under :user)
  params.permit(:first_name, :last_name, :email, :password, :password_confirmation, :phone)
end


  end

  
  