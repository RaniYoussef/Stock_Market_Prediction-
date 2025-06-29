class ApplicationController < ActionController::API
  before_action :authenticate_user!

  attr_reader :current_user

  private

  def authenticate_user!
    header = request.headers['Authorization']
    token = header&.split&.last

    if token.blank?
      return render json: { errors: ['Missing token'] }, status: :unauthorized
    end

    begin
      decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      @current_user = User.find(decoded_token['user_id'])
    rescue JWT::ExpiredSignature
      render json: { errors: ['Token has expired. Please log in again.'] }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { errors: ['Invalid token'] }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['User not found'] }, status: :unauthorized
    end
  end
end
