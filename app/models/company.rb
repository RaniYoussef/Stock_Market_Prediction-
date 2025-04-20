class Company < ApplicationRecord
    has_many :trades
    # Validations
    validates :name, presence: true, uniqueness: true
    validates :stock_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

end
