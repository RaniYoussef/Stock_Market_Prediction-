class RemoveStockPriceFromCompanies < ActiveRecord::Migration[8.0]
  def change
    remove_column :companies, :stock_price, :decimal
  end
end
