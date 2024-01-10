"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonURL = (url: string) => {
	try {
		const parsedURL = new URL(url);
		const hostname = parsedURL.hostname;

		if (
			hostname.includes("amazon.com") ||
            hostname.includes("amazon.de") ||
			hostname.includes("amazon.") ||
			hostname.endsWith("amazon")
		) {
			return true;
		}
	} catch (error) {
        console.error(error);
    }

    return false;
};

const SearchBar = () => {
	const [searchPrompt, setSearchPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isValidLink = isValidAmazonURL(searchPrompt);

        if (!isValidLink) {
            return alert('Please enter a valid Amazon link');
        }

        try {
            setIsLoading(true);

            // Scraping logic here
            const product = await scrapeAndStoreProduct(searchPrompt);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
	};

	return (
		<form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
			<input
				type="text"
				value={searchPrompt}
				placeholder="Enter product link"
				className="searchbar-input"
				onChange={(e) => setSearchPrompt(e.target.value)}
			/>

			<button type="submit" className="searchbar-btn" disabled={searchPrompt === ""}>
				{isLoading ? "Searching..." : "Search"}
			</button>
		</form>
	);
};

export default SearchBar;
