
require 'net/http'
require 'json'
require 'time'

class FetchAiPredictionJob
  @queue = :ai_prediction_queue

  # Start from first datetime (adjusted to 10:00 AM)
  @@current_time = Time.strptime("05-19-2025 14:01:00 PM", "%m-%d-%Y %I:%M:%S %p")

  # Define trading session window
  MARKET_OPEN  = 10
  MARKET_CLOSE = 14
  LAST_MINUTE  = 29

  def self.perform
    puts "🔄 Starting FetchAiPredictionJob loop..."

    loop do
      if market_open_hour?(@@current_time)
        success = try_prediction_with_retries(@@current_time, 3)

        if success
          @@current_time += 60 # move to next minute
        else
          puts "📴 Market off or no data found, skipping to next day at 10:00 AM"
          @@current_time = next_market_day(@@current_time)
        end
      else
        puts "⏩ Outside trading hours, skipping to next market day"
        @@current_time = next_market_day(@@current_time)
      end

      sleep 1
    end
  end

  def self.market_open_hour?(datetime)
    hour = datetime.hour
    minute = datetime.min

    (hour == MARKET_OPEN && minute >= 0) ||
    (hour > MARKET_OPEN && hour < MARKET_CLOSE) ||
    (hour == MARKET_CLOSE && minute <= LAST_MINUTE)
  end

  def self.next_market_day(datetime)
    Time.new(datetime.year, datetime.month, datetime.day + 1, 10, 0, 0)
  end

  def self.try_prediction_with_retries(datetime, max_retries)
    tries = 0

    while tries < max_retries
      return true if run_prediction_for(datetime)
      datetime += 60 # try next minute
      tries += 1
    end

    false
  end

  def self.run_prediction_for(datetime)
    puts "📨 Sending request for datetime: #{datetime}"

    uri = URI("http://127.0.0.1:8000/predict_next_minute/")
    request_body = { datetime: datetime.strftime("%m-%d-%Y %I:%M:%S %p") }.to_json

    begin
      response = Net::HTTP.post(uri, request_body, "Content-Type" => "application/json")

      if response.is_a?(Net::HTTPSuccess)
        result = JSON.parse(response.body)
        puts "✅ Prediction received: #{result}"

        company = Company.find(2)
        actual_price = nil

        if company
          record = company.stock_price_histories.find_by(recorded_at: datetime)
          actual_price = record&.open
        end

        Prediction.create!(
          company: company,
          predicted_open_price: result["predicted_opening_price"],
          predicted_next_move: result["predicted_move"],
          actual_open_price: actual_price,
          predicted_at: datetime
        )

        puts "💾 Saved prediction for #{datetime}"
        return true

      else
        puts "❌ Request failed: #{response.code} #{response.body}"
        return false if response.code.to_i == 404
      end

    rescue => e
      puts "❌ Error during request: #{e.message}"
    end

    false
  end
end