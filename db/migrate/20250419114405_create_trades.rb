class CreateTrades < ActiveRecord::Migration[8.0]
  def change
    create_table :trades do |t|
      t.references :user, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: true
      t.integer :stock_quantity, null: false
      t.decimal :price_per_stock, precision: 10, scale: 2, null: false
      t.string :transaction_type, null: false # "buy" or "sell"
      t.datetime :trade_time, null: false
      t.timestamps
    end
  end
end
