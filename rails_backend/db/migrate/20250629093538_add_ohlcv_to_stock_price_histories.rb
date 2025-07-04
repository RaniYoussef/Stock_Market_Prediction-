class AddOhlcvToStockPriceHistories < ActiveRecord::Migration[8.0]
  def change
    add_column :stock_price_histories, :open, :decimal
    add_column :stock_price_histories, :high, :decimal
    add_column :stock_price_histories, :low, :decimal
    add_column :stock_price_histories, :close, :decimal
    add_column :stock_price_histories, :volume, :integer
  end
end
