import React from "react";
import Image from "next/image";

import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";

const Home = () => {
	return (
		<>
			<section className="px-6 md:px-20 py-24">
				<div className="flex max-xl:flex-col gap-16">
					<div className="flex flex-col justify-center">
						<p className="small-text">
							Smart Shopping Starts Here:
							<Image
								src="/assets/icons/arrow-right.svg"
								alt="right-arrow"
								width={16}
								height={16}
							/>
						</p>
						<h1 className="head-text">
							Unleash the Power of
							<br />
							<span className="text-primary">PricePulse</span>
						</h1>
						<p className="mt-6">
							Powerful, self-serving product and growth analytics
							to help you convert, engage and retain more.
						</p>
						<SearchBar />
					</div>

                    <HeroCarousel />
				</div>
			</section>

            <section className="trending-section">
                <h2 className="section-text">Trending</h2>

                <div className="flex flex-wrap gap-x-8 gap-y-16">
                    {['Apple iPhone', 'Book', 'Sneakers'].map((product) => (
                        <div>{product}</div>
                    ))}
                </div>
            </section>
		</>
	);
};

export default Home;
