require 'open-uri'
require 'nokogiri'

class InvestingScraper

    URL = "https://www.investing.com/equities/com-intl-bk"

    def self.fetch_price
        html = URI.open(URL, "User-Agent" => "Mozilla/5.0").read
        doc = Nokogiri::HTML(html)

        # Inspect the page and find the CSS selector for the current price element
        price_element = doc.at_css('div[data-test="instrument-price-last"]')

        if price_element
            price = price_element.text.strip.gsub(',', '').to_f
            return price
        else
            puts "Price element not found"
            nil
        end
    end
end
