FactoryBot.define do
  factory :stock_price_history do
    company { nil }
    price { "9.99" }
    prediction { "MyString" }
    recorded_at { "2025-06-03 23:43:53" }
  end
end
