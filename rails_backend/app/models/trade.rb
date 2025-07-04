class Trade < ApplicationRecord
  belongs_to :user
  belongs_to :company
  # Validations
  validates :stock_quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price_per_stock, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :transaction_type, presence: true, inclusion: { in: %w[buy sell] }

  after_create :update_user_balance!
  private

  def update_user_balance!
    total_price = stock_quantity * price_per_stock
    
    if transaction_type == 'buy'
      raise "Not enough balance" if user.balance < total_price

      user.update!(balance: user.balance - total_price)
    elsif transaction_type == 'sell'
      user.update!(balance: user.balance + total_price)
    end
  end
end