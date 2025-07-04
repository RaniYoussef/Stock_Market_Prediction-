FactoryBot.define do
  factory :prediction do
    company { nil }
    predicted_open_price { 1.5 }
    predicted_next_move { 1 }
    actual_open_price { 1.5 }
    predicted_at { "2025-07-01 16:34:49" }
  end
end
