class CreateStockPriceHistories < ActiveRecord::Migration[8.0]
  def change
    create_table :stock_price_histories do |t|
      t.references :company, null: false, foreign_key: true
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :prediction
      t.datetime :recorded_at

      t.timestamps
    end
  end
end
