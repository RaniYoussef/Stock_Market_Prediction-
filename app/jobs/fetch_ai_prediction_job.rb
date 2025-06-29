require 'net/http'
require 'json'

class FetchAiPredictionJob
  @queue = :ai_prediction_queue

  def self.perform
    puts "🔄 FetchAiPredictionJob running..."

    uri = URI("http://127.0.0.1:8000/predict/")  # Replace with your FastAPI URL

    # ✅ Replace with your actual feature logic
    features = [48.69, 48.70, 48.69, 48.70, 1866.66, 1, 0]

    request_body = { features: features }.to_json

    response = Net::HTTP.post(uri, request_body, "Content-Type" => "application/json")

    if response.is_a?(Net::HTTPSuccess)
      result = JSON.parse(response.body)
      puts "✅ Prediction received: #{result}"

      company = Company.find_by(name: "Tesla")  # Or your target company

      if company
        StockPrediction.create!(
          company: company,
          predicted_price: result["predicted_open_price"],
          trend: result["predicted_label"] == 1 ? "Up" : "Down",
          predicted_for: Time.current + 1.minute,
          generated_at: Time.current
        )
      else
        puts "❌ Company not found!"
      end

    else
      puts "❌ Failed: #{response.code} #{response.body}"
    end

  rescue => e
    puts "❌ Error in FetchAiPredictionJob: #{e.message}"
  end
end
