require 'net/http'
require 'json'
require 'uri'

class YahooFinanceFetcher
  # Yahoo Finance quote endpoint for real‐time data
  QUOTE_URL = "https://query1.finance.yahoo.com/v7/finance/quote"

  # Fetches the latest trade price for a given symbol (e.g., "COMI.CA")
  # Returns a Float price or nil if not found/error.
  def self.fetch_price(symbol)
    uri = URI.parse(QUOTE_URL)
    uri.query = URI.encode_www_form({ symbols: symbol })

    response = Net::HTTP.get_response(uri)
    return nil unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    result = data.dig("quoteResponse", "result", 0)
    return nil unless result

    price = result["regularMarketPrice"] || result["bid"] || result["ask"]
    return nil unless price.is_a?(Numeric)

    price.to_f
  rescue JSON::ParserError, StandardError => e
    Rails.logger.error "YahooFinanceFetcher error for #{symbol}: #{e.message}"
    nil
  end
end
