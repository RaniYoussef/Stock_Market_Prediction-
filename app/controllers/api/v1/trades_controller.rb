class Api::V1::TradesController < ApplicationController
  before_action :authenticate_user!, only: [:create]  # Only require auth for creating a trade
  before_action :set_user
  before_action :set_company

  def create
    # Initialize the trade object
    trade = @user.trades.build(trade_params)
    trade.company = @company
    trade.price_per_stock = @company.stock_price

    total_cost = trade.stock_quantity * trade.price_per_stock

    # Handle Buy transaction: Ensure the user has enough balance
    if trade.transaction_type == 'buy'
      if @user.balance < total_cost
        return render json: { error: 'Insufficient balance' }, status: :unprocessable_entity
      end
    end

    # Handle Sell transaction: Ensure the user has enough stocks
    if trade.transaction_type == 'sell'
      bought_stocks = @user.trades.where(company: @company, transaction_type: 'buy').sum(:stock_quantity)
      sold_stocks  = @user.trades.where(company: @company, transaction_type: 'sell').sum(:stock_quantity)
      net_stock_balance = bought_stocks - sold_stocks

      if net_stock_balance < trade.stock_quantity
        return render json: { error: 'Insufficient stocks' }, status: :unprocessable_entity
      end
    end

    # Save the trade record and export updated data
    if trade.save
      DataExporter.export_all  # 👈 Export after successful trade
      render json: trade, status: :created
    else
      render json: trade.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_company
    @company = Company.find(params[:company_id] || params[:trade][:company_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Company not found' }, status: :not_found
  end

  def trade_params
    params.require(:trade).permit(:stock_quantity, :transaction_type)
  end
end
