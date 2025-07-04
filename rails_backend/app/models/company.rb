class Company < ApplicationRecord
    # Associations
    has_many :trades, dependent: :destroy
    has_many :stock_price_histories, dependent: :destroy
    has_many :predictions
    # Validations
    validates :name, presence: true, uniqueness: true
    validates :ticker_symbol, presence: true, uniqueness: true

    def latest_price

        stock_price_histories.order(recorded_at: :desc).limit(1).pluck(:price).first
    end

    def latest_prediction
        stock_price_histories.order(recorded_at: :desc).limit(1).pluck(:prediction).first
    end

end
