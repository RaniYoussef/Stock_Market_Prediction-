require 'net/http'
require 'uri'
require 'json'

class EodFetcher
  # Endpoint for historical EOD data:
  # Example: https://eodhistoricaldata.com/api/eod/COMI.EG?api_token=YOUR_KEY&fmt=json&limit=1
  HISTORICAL_URL = "https://eodhistoricaldata.com/api/eod"

  # Fetch the most recent closing price for a symbol (e.g., "COMI.EG").
  # Returns Float or nil.
  def self.fetch_price(symbol)
    api_key = ENV['EOD_API_KEY']
    raise "EOD_API_KEY not set" if api_key.nil? || api_key.empty?

    # Build URI: limit=1 returns only the latest available record
    uri = URI.parse("#{HISTORICAL_URL}/#{symbol}?api_token=#{api_key}&fmt=json&limit=1")
    response = Net::HTTP.get_response(uri)
    return nil unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    # data is an array of hashes, e.g.:
    # [
    #   {
    #     "date":"2025-06-03",
    #     "open":80.50,
    #     "high":81.00,
    #     "low":80.00,
    #     "close":80.75,
    #     "adjusted_close":80.75,
    #     "volume":1234567,
    #     "dividend":0,
    #     "split":1
    #   }
    # ]
    latest = data.first
    return nil unless latest && latest["close"].is_a?(Numeric)

    latest["close"].to_f
  rescue JSON::ParserError, StandardError => e
    Rails.logger.error "EodFetcher error for #{symbol}: #{e.message}"
    nil
  end
end
