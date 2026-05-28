import fs from 'fs';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'cm33r3-3j.myshopify.com',
  apiVersion: '2026-04',
  publicAccessToken: '1ecfa030b0d5cc92ad7d95875a8cddcd',
});

const pageHandles = [
  'size-chart',
  'women-size-chart',
  'unisex-sweatshirts-size-chart',
  'a-new-era-cropped-sweatshirt-size-chart',
  'unisex-hoodies-size-chart',
  't-shirt-size-chart',
  'linen-shirt-shorts-size-chart',
  'staple-sand-unisex-size-chart'
];

async function fetchSizeCharts() {
  const sizeCharts = {};

  for (const handle of pageHandles) {
    console.log(`Fetching page ${handle}...`);
    try {
      const query = `
        {
          page(handle: "${handle}") {
            title
            body
          }
        }
      `;
      const response = await client.request(query);
      const page = response.data?.page;
      if (page) {
        sizeCharts[handle] = {
          title: page.title,
          body: page.body
        };
        console.log(`Successfully fetched ${handle}`);
      } else {
        console.log(`Page ${handle} not found`);
      }
    } catch (err) {
      console.error(`Error fetching ${handle}:`, err);
    }
  }

  fs.writeFileSync('src/data/shopify_size_charts.json', JSON.stringify(sizeCharts, null, 2));
  console.log('Saved size charts to src/data/shopify_size_charts.json');
}

fetchSizeCharts();
