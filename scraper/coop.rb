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
		$iv = 0
		$ih = 0
		$dayname = Array.new
		$hours = Array.new
		$i = 0			
		
		puts $butiknr
	
		puts content.search('dl dt a').text
	
		content.search('ul li').each do |oppettid|
			
			oppettid.text.delete("<li>").delete("</li>")
			
			if oppettid.text.match(/[0-2]?[0-9]\:[0-6][0-9]/) == nil and oppettid.text.downcase.match(/stängt/) == nil and oppettid.text.downcase.match(/veckans erbjudande/) == nil and oppettid.text.downcase.match(/visa på kartan/) == nil and oppettid.text.downcase.match(/avvikande öppettider/) == nil
				$dayname[$iv] = oppettid.text
				$iv += 1
			end
			
			if oppettid.text.match(/[0-2]?[0-9]\:[0-6][0-9]/) or oppettid.text.downcase.match(/stängt/)
				$hours[$ih] = oppettid.text
				$ih += 1
			end
		end
		
		
		$dayname.each do |opentheday|
			if($hours[$i]) # This row prevents the application from crashing
				# THIS IS ONLY A TEST.
				puts opentheday + " " + $hours[$i]
				$i += 1
			end
		end

		$butiknr = $butiknr+1

	end

end