class Api::V1::StockPredictionsController < ApplicationController
  # ✅ If you want only the system/admin to push predictions:
  before_action :authenticate_user!
  before_action :authorize_admin!

  def create
    company = Company.find_by(id: params[:company_id])
    return render json: { error: "Company not found" }, status: :not_found unless company

    prediction = company.stock_predictions.create!(
      predicted_price: params[:predicted_price],
      trend: params[:trend],
      predicted_for: params[:predicted_for],
      generated_at: Time.current
    )

    render json: { message: "Prediction saved", prediction: prediction }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def authorize_admin!
    render json: { error: "Only admins can push predictions" }, status: :forbidden unless @current_user.role == "admin"
  end
end
