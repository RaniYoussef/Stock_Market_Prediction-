# app/services/data_exporter.rb
require 'json'

class DataExporter
  EXPORT_PATH = Rails.root.join('public', 'export.json')

  def self.export_all
    data = {
      users: User.all.as_json(only: [:id, :email, :balance, :role]),
      companies: Company.all.as_json(only: [:id, :name, :stock_price]),
      trades: Trade.all.as_json(only: [:id, :user_id, :company_id, :stock_quantity, :price_per_stock, :transaction_type, :created_at])
    }

    File.open(EXPORT_PATH, 'w') do |f|
      f.write(JSON.pretty_generate(data))
    end
  end
end
