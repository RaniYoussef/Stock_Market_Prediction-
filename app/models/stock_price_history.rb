class StockPriceHistory < ApplicationRecord
  belongs_to :company

  #validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :open, :high, :low, :close, :volume, presence: true
  validates :open, :high, :low, :close, numericality: true
  validates :volume, numericality: { only_integer: true }
  validates :recorded_at, presence: true

  validates :recorded_at, presence: true
  validates :prediction, inclusion: { in: ['Up', 'Down'], message: "%{value} is not a valid prediction" }, allow_nil: true
end
