class AddStockPriceToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :stock_price, :decimal
  end
end
