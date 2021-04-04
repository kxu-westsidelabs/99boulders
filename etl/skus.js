const { exec } = require("child_process");
const { parse } = require("node-html-parser");

const RETAILERS = [
    { name: 'rei', datafeed_id: 115 },
    { name: 'backcountry', datafeed_id: 52 },
    //{ name: 'osprey', datafeed_id: 6969 },
];

(async function() {
    const product = process.argv[2];

    for (const retailer of RETAILERS) {
        search(product, retailer);
        await new Promise(r => setTimeout(r, 2000));
    }
})();

function search(product, retailer) {

    const command = `curl 'https://classic.avantlink.com/affiliate/api_request_choose_product_sku.php' \
  -H 'authority: classic.avantlink.com' \
  -H 'cache-control: max-age=0' \
  -H 'sec-ch-ua: "Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'origin: https://classic.avantlink.com' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-user: ?1' \
  -H 'sec-fetch-dest: document' \
  -H 'referer: https://classic.avantlink.com/affiliate/api_request_choose_product_sku.php?merchant_ids=10248&datafeed_ids=${retailer.datafeed_id}' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cookie: userDeviceId=dbce491c-835d-4aca-ab58-8e520d3e26e4; merchant_id_16517=179682_a20eb37c5-_-16517-pl-6969-179682-127-6969%7E; merchant_id_10060=179682_c20eb1dc5-_-10060-pl-52-179682-1213831-52%7E; merchant_id_10248=179682_c20eb1dd9-_-10248-pl-115-179682-631406-115%7E; authorization=efd00d008b350641aa114597a0c219432b78c44a%3B33180f9a2a930ce7cd1ac9ecd570ce6487e08358%3B1617399930%3B0067300c-5389-4158-abb7-5e701888b098%3BPT30M' \
  --data-raw 'strSearchTerm=${product}&cmdSubmit=Filter+Products&lngMerchantId=10248&lngDatafeedId=${retailer.datafeed_id}' \
  --compressed`;

    child = exec(command, function(error, stdout, stderr) {
        try {
            const dom = parse(stdout);
            const results = dom
                .querySelector('.av_search_results_table');

            console.log(`${retailer.name}`);
            console.log(`------------`);
            for (const child of results.childNodes.slice(2)) {
                if (child.rawTagName === 'tr') {
                    const product = child.childNodes[4].text.trim();
                    const sku = child.childNodes[3].text.trim();
                    console.log(`${sku}\t ${product}`);
                }
            }
            console.log(`\n`);
        } catch (err) {
        }
    });
}


