class UpdateStockPricesJob < ApplicationJob
  queue_as :default

  def perform
    Company.find_each do |company|
      Rails.logger.info("Fetching price for company #{company.name} (#{company.ticker_symbol})")

      new_price, prediction = fetch_stock_price_and_prediction(company.ticker_symbol)
      
      if new_price
        StockPriceHistory.create!(
          company: company,
          price: new_price,
          prediction: prediction,
          recorded_at: Time.current
        )
        company.update(stock_price: new_price)
        Rails.logger.info("Saved price #{new_price} for #{company.name}")
      else
        Rails.logger.warn("Failed to fetch price for #{company.name}")
      end
    end
  end

  private

  def fetch_stock_price_and_prediction(ticker)
    price = StockPriceFetcher.fetch_price(ticker) # your external fetcher
    return nil, nil unless price

    prediction = ["Up", "Down"].sample
    [price, prediction]
  rescue StandardError => e
    Rails.logger.error("Error fetching stock price for #{ticker}: #{e.message}")
    [nil, nil]
  end
end
