class ApplicationController < ActionController::API
  before_action :authenticate_user!, except: [:signup, :login]
  

  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split.last if header.present?

    begin
      decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      @current_user = User.find(decoded_token["user_id"])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { errors: ['Invalid or expired token'] }, status: :unauthorized
    end
  end
end
