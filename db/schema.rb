# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_29_113742) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ticker_symbol"
    t.decimal "stock_price"
    t.index ["ticker_symbol"], name: "index_companies_on_ticker_symbol", unique: true
  end

  create_table "stock_predictions", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.decimal "predicted_price"
    t.string "trend"
    t.datetime "predicted_for"
    t.datetime "generated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_stock_predictions_on_company_id"
  end

  create_table "stock_price_histories", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "prediction"
    t.datetime "recorded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "open"
    t.decimal "high"
    t.decimal "low"
    t.decimal "close"
    t.integer "volume"
    t.index ["company_id"], name: "index_stock_price_histories_on_company_id"
  end

  create_table "trades", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "company_id", null: false
    t.integer "stock_quantity"
    t.decimal "price_per_stock"
    t.string "transaction_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_trades_on_company_id"
    t.index ["user_id"], name: "index_trades_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "role", default: "user"
    t.decimal "balance", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "provider"
    t.string "uid"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
  end

  add_foreign_key "stock_predictions", "companies"
  add_foreign_key "stock_price_histories", "companies"
  add_foreign_key "trades", "companies"
  add_foreign_key "trades", "users"
end
