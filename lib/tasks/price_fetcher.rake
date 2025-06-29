namespace :prices do
  desc "Fetch CIB Bank (COMI.EG) price from EOD and store it"
  task fetch_cib: :environment do
    company = Company.find_by(name: "CIB Bank")
    unless company
      puts "CIB Bank not found in database"
      next
    end

    eod_symbol = "COMI.EG"
    price = EodFetcher.fetch_price(eod_symbol)

    if price.nil? || price.zero?
      puts "Failed to fetch valid price for #{eod_symbol}"
      next
    end

    StockPriceHistory.create!(
      company: company,
      price: price,
      prediction: ["Up", "Down"].sample,
      recorded_at: Time.current
    )

    # Ensure your Company model has a decimal column `stock_price`
    company.update(stock_price: price)

    puts "CIB Bank (#{eod_symbol}) price updated: #{price}"
  end
end
