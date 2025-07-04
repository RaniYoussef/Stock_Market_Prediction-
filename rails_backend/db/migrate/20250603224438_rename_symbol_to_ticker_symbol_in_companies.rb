class RenameSymbolToTickerSymbolInCompanies < ActiveRecord::Migration[8.0]
  def change
    rename_column :companies, :symbol, :ticker_symbol
  end

end
