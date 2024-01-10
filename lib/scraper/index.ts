"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(productURL: string) {
	if (!productURL) {
		return;
	}

	// BrightData proxy configuration
	const username = String(process.env.BRIGHT_DATA_USERNAME);
	const password = String(process.env.BRIGHT_DATA_PASSWORD);
	const port = 22225;
	const session_id = (1000000 * Math.random()) | 0;
	const options = {
		auth: {
			username: `${username}-session-${session_id}`,
			password,
		},
		host: "brd.superproxy.io",
		port,
		rejectUnauthorized: false,
	};

	try {
		const response = await axios.get(productURL, options);
		const $ = cheerio.load(response.data);

		const title = $("#productTitle").text().trim();
		const currentPrice = extractPrice(
			$(".priceToPay span.a-price-whole"),
			$(".a.size.base.a-color-price"),
			$(".a-button-selected .a-color-base")
		).match(/^(\d+\.\d{3})/)[0];

		const originalPrice = extractPrice(
			$("#priceblock_ourprice"),
			$(".a-price.a-text-price span.a-offscreen"),
			$("#listPrice"),
			$("#priceblock_dealprice"),
			$(".a-size-base.a-color-price")
		).match(/^(\d+\.\d{3})/)[0];

		const outOfStock =
			$("#availability span").text().trim().toLowerCase() ===
			"currently unavailable.";

		const images =
			$("#imgBlkFront").attr("data-a-dynamic-image") ||
			$("#landingImage").attr("data-a-dynamic-image") ||
			"{}";

		const imageUrls = Object.keys(JSON.parse(images));

		const currency = extractCurrency($(".a-price-symbol"))[0];

		const discountRate = $(".savingsPercentage")
			.text()
			.replace(/[-%]/g, "")
            .match(/^(\d+)\s/);

        const description = extractDescription($);

		const data = {
			productURL,
			currency: currency || "$",
			imageUrls: imageUrls[0],
			title,
			currentPrice: Number(currentPrice) || Number(originalPrice),
			originalPrice: Number(originalPrice) || Number(currentPrice),
			priceHistory: [],
			discountRate: discountRate,
			category: "category",
			isOutOfStock: outOfStock,
            // description,
            // lowestPrice: Number(currentPrice) || Number(originalPrice),
            // highestPrice: Number(originalPrice) || Number(currentPrice),
            // averagePrice: Number(currentPrice) || Number(originalPrice)
		};

		console.log(data);
	} catch (error: any) {
		throw new Error(`Failed to scrape product: ${error.message}`);
	}
}
