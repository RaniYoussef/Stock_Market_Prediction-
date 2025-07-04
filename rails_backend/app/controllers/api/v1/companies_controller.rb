# rails_backend/app/controllers/api/v1/companies_controller.rb

class Api::V1::CompaniesController < ApplicationController
  before_action :authenticate_user!, only: %i[create update destroy]
  before_action :authorize_admin!, only: %i[create update destroy]
  before_action :set_company, only: %i[show update destroy price_history prediction prediction_after]

  # GET /api/v1/companies
  def index
    companies = Company.all

    render json: companies.map { |company|
      {
        id: company.id,
        name: company.name,
        latest_price: company.latest_price,
        latest_prediction: company.latest_prediction,
        last_updated_at: company.stock_price_histories.maximum(:recorded_at)
      }
    }, status: :ok
  end

  # GET /api/v1/companies/:id
  def show
    render json: {
      id: @company.id,
      name: @company.name,
      latest_price: @company.latest_price,
      latest_prediction: @company.latest_prediction,
      last_updated_at: @company.stock_price_histories.maximum(:recorded_at)
    }, status: :ok
  end

  # POST /api/v1/companies
  def create
    company = Company.new(company_params)

    if company.save
      DataExporter.export_all
      render json: { message: 'Company created successfully', company: company }, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/companies/:id
  def update
    if @company.update(company_params)
      render json: { message: 'Company updated successfully', company: @company }, status: :ok
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/companies/:id
  def destroy
    @company.destroy
    render json: { message: 'Company deleted successfully' }, status: :ok
  end

  # GET /api/v1/companies/:id/price_history
  def price_history
    history = @company.stock_price_histories.order(:recorded_at).limit(100)

    render json: history.map { |record|
      {
        timestamp: record.recorded_at.strftime("%Y-%m-%d %H:%M:%S"),
        open: record.open,
        high: record.high,
        low: record.low,
        close: record.close,
        volume: record.volume
      }
    }, status: :ok
  end

  # GET /api/v1/companies/:id/prediction
  def prediction
    prediction = @company.predictions.order(predicted_at: :desc).first

    if prediction
      formatted_time = prediction.predicted_at.in_time_zone("Africa/Cairo").strftime("%Y-%m-%d %H:%M:%S")

      render json: {
        company: @company.name,
        prediction: {
          predicted_open_price: prediction.predicted_open_price,
          predicted_next_move: prediction.predicted_next_move,
          predicted_for: formatted_time,
          actual_open_price: prediction.actual_open_price
        }
      }, status: :ok
    else
      render json: { error: 'No prediction available' }, status: :not_found
    end
  end

  # GET /api/v1/companies/:id/prediction_after?after=YYYY-MM-DD HH:MM:SS
  def prediction_after
    after_time = Time.zone.parse(params[:after]) rescue nil

    if after_time.nil?
      return render json: { error: "Invalid or missing 'after' parameter" }, status: :bad_request
    end

    prediction = @company.predictions
                         .where("predicted_at > ?", after_time)
                         .order(predicted_at: :asc)
                         .first

    if prediction
      formatted_time = prediction.predicted_at.in_time_zone("Africa/Cairo").strftime("%Y-%m-%d %H:%M:%S")

      render json: {
        company: @company.name,
        prediction: {
          predicted_open_price: prediction.predicted_open_price,
          predicted_next_move: prediction.predicted_next_move,
          predicted_for: formatted_time,
          actual_open_price: prediction.actual_open_price
        }
      }, status: :ok
    else
      render json: { prediction: nil }, status: :ok
    end
  end

  private

  def set_company
    @company = Company.find_by(id: params[:id] || params[:company_id])
    render json: { error: 'Company not found' }, status: :not_found unless @company
  end

  def company_params
    params.require(:company).permit(:name, :ticker_symbol)
  end

  def authorize_admin!
    unless @current_user&.role == 'admin'
      render json: { error: 'Only admins can perform this action' }, status: :forbidden
    end
  end
end
