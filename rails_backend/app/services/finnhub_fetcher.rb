require 'net/http'
require 'json'

class FinnhubFetcher
  API_URL = "https://finnhub.io/api/v1/quote"
  API_KEY = ENV['FINNHUB_API_KEY']

  # Fetches the current price for a given Finnhub symbol (e.g., "COMI:EGX")
  # Returns the numeric price (float) or nil if something goes wrong.
  def self.fetch_price(symbol)
    raise "FINNHUB_API_KEY not set" if API_KEY.nil? || API_KEY.empty?

    uri = URI(API_URL)
    uri.query = URI.encode_www_form(
      symbol: symbol,
      token:   API_KEY
    )

    response = Net::HTTP.get_response(uri)
    return nil unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    # Finnhub returns a JSON like:
    # { "c": 80.5, "h": 81.0, "l": 79.5, "o": 80.0, "pc": 80.1, "t": 1627392000 }
    # "c" is the current price
    current = data['c']
    return nil unless current.is_a?(Numeric)

    current.to_f
  rescue JSON::ParserError, StandardError => e
    Rails.logger.error "Error fetching Finnhub price for #{symbol}: #{e.message}"
    nil
  end
end
