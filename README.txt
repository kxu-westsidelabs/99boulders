Project Structure
/0_html
	- contains rei.com product page source
/1_api
	- output of extract_api.js
	- contains lightly processed AvantLink API data
		- REI ProductContent
		- REI/BC/Osprey PriceHistory
/2_web
	- output of extract_web.js
	- contains product specs scraped from REI.com product pages
/3_data
	- output of transform.js
	- relatively final product output for each product
		- product specs, pricing history, etc
/4_pages
	- generated (and lightly edited) pages for each pair of products

Scripts
- extract_api.js - hit the Avantlink API and pull down data for given SKUs
	> node extract_api.js 126707 OSP00AM 10001428 true > 1_api/126707.json

- extract_web.js - read the REI.com product pages and scrape relevant data
	> node extract_web.js 113327 true > 2_web/113327.json

- transform.js - read json data from 1_api and 2_web, clean up, and format
	> node transform.js 111299 > 3_data/111299.json

- load.js - generate the HTML and JS for the static site
	- note, the output of this needs light editing (title, chart data/labels)
	> node load.js 126709 134072 | pbcopy
	> paste into generated.html
	> cp generated.html 4_pages/talon-22-vs-stratos-24.html


Comparison Pages
- exos-48-vs-exos-58.html
- stratos-24-vs-stratos-34.html
- stratos-34-vs-stratos-36.html
- talon-22-vs-stratos-24.html
- exos-58-vs-atmos-65.html
- atmos-50-vs-atmos-65.html
- exos-58-vs-atmos-50.html
- aether-65-vs-atmos-65.html