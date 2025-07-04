class CreatePredictions < ActiveRecord::Migration[8.0]
  def change
    create_table :stock_predictions do |t|
      t.references :company, null: false, foreign_key: true
      t.decimal :predicted_open_price, precision: 10, scale: 2
      t.string :predicted_next_move
      t.decimal :actual_open_price, precision: 10, scale: 2
      t.datetime :predicted_at

      t.timestamps
    end
  end
end