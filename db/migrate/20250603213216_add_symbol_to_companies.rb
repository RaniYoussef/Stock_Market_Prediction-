class AddSymbolToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :symbol, :string
    add_index :companies, :symbol, unique: true
  end
end
