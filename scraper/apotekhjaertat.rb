# Copyright (C) 2011 by
# Emil @sakjur Tullstedt <sakjur@gmail.com>
#
# This Ruby script requires:
# gem mechanize
# gem nokogirl (provided by mechanize)
# ruby 1.9
# libxslt-ruby
# libxml2-ruby

# Including gems
require "mechanize"

# Define important variables
agent = Mechanize.new
$pagenum = 1
$totalpages = 28
$storenum = 1

# Download each search result page.
while $pagenum <= $totalpages do
    page = agent.get('http://www.apotekhjartat.se/hitta-apotek-hjartat/?q=*&defbn=' + $pagenum.to_s)

    # Increase counter by one.
    $pagenum = $pagenum+1 # CAUTION! Eternal loop if removed.

    # Print each store
    page.search('.pharmacy-search-result h2 a').each do |content|

        # Prints some relevant information
        puts $storenum
        puts content.text + "\n"
        puts content.attribute("href").to_s + "\n"

        # Increase counter by one.
        $storenum = $storenum+1

    end

end