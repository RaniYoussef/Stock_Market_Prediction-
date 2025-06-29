class Api::V1::StockPriceHistoriesController < ApplicationController

    before_action :authenticate_user!
    before_action :authorize_admin!

    def create
        company = Company.find_by(id: params[:company_id])
        return render json: { error: 'Company not found' }, status: :not_found unless company

        price = params[:price]
        prediction = params[:prediction] # Optional for now

        stock_price_history = company.stock_price_histories.new(
            price: price,
            prediction: prediction,
            recorded_at: Time.current
        )
        if stock_price_history.save

            render json: { message: 'Price history recorded', entry: stock_price_history }, status: :created
        else
            render json: { errors: stock_price_history.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def authorize_admin!
        render json: { error: 'Only admins can perform this action' }, status: :forbidden unless @current_user&.role == 'admin'
    end
end
