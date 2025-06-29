class Api::V1::CompaniesController < ApplicationController

  before_action :authenticate_user!, only: %i[create update destroy]
  before_action :authorize_admin!, only: %i[create update destroy]
  before_action :set_company, only: %i[show update destroy price_history prediction]

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
        timestamp: record.recorded_at,
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
    prediction = @company.stock_predictions.order(predicted_for: :desc).first

    if prediction
      render json: {
        company: @company.name,
        prediction: {
          price: prediction.predicted_price,
          trend: prediction.trend,
          predicted_for: prediction.predicted_for
        }
      }, status: :ok
    else
      render json: { error: 'No prediction available' }, status: :not_found
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
