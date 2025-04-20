class CreateTrades < ActiveRecord::Migration[8.0]
  def change
    create_table :trades do |t|
      t.references :user, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: true
      t.integer :stock_quantity
      t.decimal :price_per_stock
      t.string :transaction_type

      t.timestamps
    end
  end
end
