FactoryBot.define do
  factory :stock_prediction do
    company { nil }
    predicted_price { "9.99" }
    trend { "MyString" }
    predicted_for { "2025-06-29 10:18:40" }
    generated_at { "2025-06-29 10:18:40" }
  end
end
