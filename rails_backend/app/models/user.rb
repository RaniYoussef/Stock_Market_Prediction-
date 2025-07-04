class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, 
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null
  # 📊 Associations
  has_many :trades, dependent: :destroy

  # ✅ Validations
  validates :email, presence: true, uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: 'must be a valid email address' }

  validates :balance, numericality: { greater_than_or_equal_to: 0 }

 validates :phone, presence: true,
                  format: { with: /\A(\+?\d{1,3})?\d{10,15}\z/, message: "must be a valid phone number with optional country code" },
                  unless: :resetting_password?

  # 🔁 Password Reset Helper
  attr_accessor :skip_phone_validation_for_password_reset

  def resetting_password?
    @skip_phone_validation_for_password_reset
  end
end
