module Api
  module V1
    class PasswordsController < ApplicationController
      skip_before_action :authenticate_user!

      def forgot
        user = User.find_by(email: params[:email])
        if user.present?
          raw_token = user.send_reset_password_instructions
          render json: { 
            message: "Reset instructions sent",
            reset_token: raw_token # Only include this in development!
          }, status: :ok
        else
          render json: { errors: ["Email not found"] }, status: :not_found
        end
      end

      def reset
        user = User.with_reset_password_token(params[:reset_password_token])
        
        if user.blank?
          return render json: { errors: ["Invalid reset token"] }, status: :unprocessable_entity
        end
        #user.skip_phone_validation_for_password_reset = true
        if user.reset_password(params[:password], params[:password_confirmation])
          render json: { message: "Password has been reset successfully" }, status: :ok
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def reset_password_params
        params.permit(:reset_password_token, :password, :password_confirmation)
      end
    end
  end
end