class Api::V1::TradesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company

  def create
    trade = @current_user.trades.build(trade_params)
    trade.company = @company

    # ✅ Get latest prediction or actual
    prediction = @company.stock_predictions.order(predicted_for: :desc).first
    price = prediction&.predicted_price || @company.stock_price_histories.order(recorded_at: :desc).first.open

    return render json: { error: 'No price available' }, status: :unprocessable_entity unless price

    trade.price_per_stock = price
    # ⏪ Remove: trade.executed_at = Time.current

    total_cost = trade.stock_quantity * price

    unless %w[buy sell].include?(trade.transaction_type)
      return render json: { error: 'Invalid transaction type' }, status: :unprocessable_entity
    end

    if trade.transaction_type == 'buy'
      if @current_user.balance < total_cost
        return render json: { error: 'Insufficient balance' }, status: :unprocessable_entity
      end
      @current_user.balance -= total_cost

    elsif trade.transaction_type == 'sell'
      total_bought = @current_user.trades.where(company: @company, transaction_type: 'buy').sum(:stock_quantity)
      total_sold = @current_user.trades.where(company: @company, transaction_type: 'sell').sum(:stock_quantity)
      owned = total_bought - total_sold

      if owned < trade.stock_quantity
        return render json: { error: 'Not enough stocks to sell' }, status: :unprocessable_entity
      end

      @current_user.balance += total_cost
    end

    ActiveRecord::Base.transaction do
      @current_user.save!
      trade.save!
    end

    render json: {
      trade: trade,
      prediction_used: {
        predicted_price: prediction&.predicted_price,
        trend: prediction&.trend
      },
      balance: @current_user.balance
    }, status: :created

  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def trade_params
    params.require(:trade).permit(:stock_quantity, :transaction_type)
  end
end
