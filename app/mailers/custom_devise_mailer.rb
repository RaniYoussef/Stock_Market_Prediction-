class CustomDeviseMailer < Devise::Mailer
  #helper :application
  include Devise::Controllers::UrlHelpers
  default template_path: 'devise/mailer'

  def reset_password_instructions(record, token, opts = {})
    @token = token
    @resource = record

    reset_link = "http://192.168.10.134:3001/reset-password?token=#{token}"

    mail(to: record.email, subject: 'Reset your password') do |format|
      format.text do
        render plain: <<~TEXT
          Hello #{@resource.email}!

          You requested a password reset.

          Click the link below to reset your password:
          #{reset_link}

          If you didn't request this, just ignore this email.
        TEXT
      end
    end
  end
end
