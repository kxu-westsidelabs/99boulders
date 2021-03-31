# skus (rei bc osprey)
# ---
# 813623 OPAL123 1234
# 127968 JET001Z 1234
# 876918 JET000B 1234

while read line; do
    skus=($line)

    if [ "$line" == "" ]; then
        continue;
    fi

    echo "${skus[0]}";
    echo "-----------";

    # Step 0: Fetch HTML
    echo "fetching html...";
    node 0_scrape.js ${skus[0]} > 0_html/${skus[0]}.html

    # Step 1: Fetch API data
    echo "fetching API data...";
    node 1_extract_api.js ${line} > 1_api/${skus[0]}.json

    # Step 2: Scrape web data
    echo "scraping data from page...";
    node 2_extract_web.js ${skus[0]} > 2_web/${skus[0]}.json

    # Step 3: Merge the data
    echo "creating product data...";
    node 3_transform.js ${skus[0]} > 3_data/${skus[0]}.json

    echo "\n";

done < skus.txt
#done < batch.txt
