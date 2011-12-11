#
# Copyright (C) 2011 by
# Emil @sakjur Tullstedt <sakjur@gmail.com>
#
# This Ruby script requires:
# gem mechanize
# gem nokogirl (provided by mechanize)
# ruby 1.9
# libxslt-ruby
# libxml2-ruby

require "mechanize"

agent = Mechanize.new

$sidnr = 1
$butiknr = 1

while $sidnr <= 50 do
	page = agent.get('http://www.coop.se/Sok/Butikssok/?q=*&bn=' + $sidnr.to_s)
	$sidnr = $sidnr+1

	page.search('.shopResult').each do |content|
		puts $butiknr
	
		puts content.search('dl dt a').text

		content.search('ul li').each do |oppettid|
			if oppettid.text.match(/[0-9]\:[0-9]/) or oppettid.text.downcase.match(/stängt/)
				puts oppettid
			end
		end

		$butiknr = $butiknr+1

	end

end
