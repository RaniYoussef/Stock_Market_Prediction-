class StockPriceFetcher
  API_URL = "https://www.alphavantage.co/query"
  API_KEY = ENV['ALPHA_VANTAGE_API_KEY']

  def self.fetch_price(symbol)
    raise "API key not set" if API_KEY.nil? || API_KEY.empty?

    uri = URI(API_URL)
    params = {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: API_KEY
    }
    uri.query = URI.encode_www_form(params)

    response = Net::HTTP.get_response(uri)

    puts "Raw response: #{response.body}"  # ✅ Debug line

    return nil unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    quote = data['Global Quote']

    unless quote && quote['05. price']
      puts "No price data found for #{symbol}. Full response:"
      puts data.inspect
      return nil
    end

    quote['05. price'].to_f
  rescue JSON::ParserError, StandardError => e
    Rails.logger.error "Error fetching stock price for #{symbol}: #{e.message}"
    nil
  end
end
