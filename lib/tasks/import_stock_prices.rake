namespace :import do
  desc "Import stock prices for one company from CSV"
  task stock_prices: :environment do
    require 'csv'
    
    file_path = 'lib\assets\COMI_OHLCV.csv'

    company = Company.find_or_create_by!(name: "Tesla") # adjust name

    CSV.foreach(file_path, headers: true) do |row|
      recorded_at = row['datetime']   # column name must match your CSV
      open_price  = row['Open']
      high_price  = row['High']
      low_price   = row['Low']
      close_price = row['Close']
      volume      = row['Volume']

      StockPriceHistory.create!(
        company: company,
        recorded_at: recorded_at,
        open: open_price,
        high: high_price,
        low: low_price,
        close: close_price,
        volume: volume
      )
    end

    puts "✅ Import done!"
  end
end
