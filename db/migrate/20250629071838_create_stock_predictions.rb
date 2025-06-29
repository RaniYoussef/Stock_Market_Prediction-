class CreateStockPredictions < ActiveRecord::Migration[8.0]
  def change
    create_table :stock_predictions do |t|
      t.references :company, null: false, foreign_key: true
      t.decimal :predicted_price
      t.string :trend
      t.datetime :predicted_for
      t.datetime :generated_at

      t.timestamps
    end
  end
end
