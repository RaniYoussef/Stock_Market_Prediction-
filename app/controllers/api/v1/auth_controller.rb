class Api::V1::AuthController < ApplicationController
    
    def signup
      role = params[:user][:role] == "admin" ? "admin" : "user"
      balance = params[:user][:balance] || 10_000  # Default balance if not provided
      user = User.new(signup_params.merge(role: role, balance: balance))
  
      if user.save
        # Trigger export after successfully creating a user
        DataExporter.export_all
  
        render json: { message: 'User created successfully', user: user }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def login
      user = User.find_by(email: params[:user][:email])
  
      if user && user.valid_password?(params[:user][:password])
        token = generate_jwt_token(user)
        render json: { message: 'Login successful', token: token }, status: :ok
      else
        render json: { errors: ['Invalid email or password'] }, status: :unauthorized
      end
    end
  
    def profile
      render json: { 
        user: { 
          id: @current_user.id, 
          first_name: @current_user.first_name, 
          last_name: @current_user.last_name, 
          email: @current_user.email, 
          role: @current_user.role, 
          balance: @current_user.balance 
        } 
      }
    end
  
    private
  
    def generate_jwt_token(user)
      JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.credentials.secret_key_base)
    end
  
    def signup_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :balance)
    end
  end

  
  