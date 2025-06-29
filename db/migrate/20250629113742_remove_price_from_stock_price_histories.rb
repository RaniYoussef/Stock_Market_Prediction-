class RemovePriceFromStockPriceHistories < ActiveRecord::Migration[8.0]
  def change
    remove_column :stock_price_histories, :price, :decimal
  end
end
