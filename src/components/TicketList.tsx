import { useState, useEffect } from "react";
import { Checkbox, Button, Space, Card } from "antd";

import "./ticketList.scss";

interface Ticket {
	origin: string;
	origin_name: string;
	destination: string;
	destination_name: string;
	departure_date: string;
	departure_time: string;
	arrival_date: string;
	arrival_time: string;
	carrier: string;
	stops: number;
	price: number;
}

interface Filters {
	stops: {
		all: boolean;
		nonStop: boolean;
		oneStop: boolean;
		twoStops: boolean;
		threeStops: boolean;
	};
}

const exchangeRates = {
	RUB: 1,
	USD: 0.01,
	EUR: 0.0095,
};

const defaultCurrency = "RUB";

function TicketList({ tickets }: { tickets: Ticket[] }) {
	const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
	const [filters, setFilters] = useState<Filters>({
		stops: {
			all: true,
			nonStop: false,
			oneStop: false,
			twoStops: false,
			threeStops: false,
		},
	});
	const [selectedCurrency, setSelectedCurrency] =
		useState<string>(defaultCurrency);

	useEffect(() => {
		const filterTickets = () => {
			const filtered = tickets.filter((ticket) => {
				if (filters.stops.all) return true;
				if (filters.stops.nonStop && ticket.stops === 0) return true;
				if (filters.stops.oneStop && ticket.stops === 1) return true;
				if (filters.stops.twoStops && ticket.stops === 2) return true;
				if (filters.stops.threeStops && ticket.stops === 3) return true;
				return false;
			});
			setFilteredTickets(filtered);
		};

		filterTickets();
	}, [tickets, filters]);

	const handleFilterChange = (filterType: keyof Filters["stops"]) => {
		if (filterType === "all") {
			const newFilters = {
				stops: {
					all: true,
					nonStop: false,
					oneStop: false,
					twoStops: false,
					threeStops: false,
				},
			};
			setFilters(newFilters);
		} else {
			const newFilters = {
				stops: {
					...filters.stops,
					all: false,
					[filterType]: !filters.stops[filterType],
				},
			};
			setFilters(newFilters);
		}
	};

	const handleCurrencyChange = (newCurrency: string) => {
		setSelectedCurrency(newCurrency);
	};

	const convertCurrency = (price: number, targetCurrency: string) => {
		const rate = (exchangeRates[targetCurrency as keyof typeof exchangeRates] ||
			1) as number;
		return (price * rate).toFixed(2);
	};

	const carrierImages = {
		TK: require("./svg/TK.svg").default,
		S7: require("./svg/S7.svg").default,
		SU: require("./svg/SU.svg").default,
		BA: require("./svg/BA.svg").default,
		Arrow: require("./svg/Arrow.svg").default,
	};

	return (
		<div className="tickets">
			<div>
				<p>Валюта</p>
				<Space wrap>
					<Button onClick={() => handleCurrencyChange("RUB")}>RUB</Button>
					<Button onClick={() => handleCurrencyChange("USD")}>USD</Button>
					<Button onClick={() => handleCurrencyChange("EUR")}>EUR</Button>
				</Space>
				<div className="tickets__filters">
					Количество пересадок
					<Checkbox
						checked={filters.stops.all}
						onChange={() => handleFilterChange("all")}
					>
						Все
					</Checkbox>
					<Checkbox
						checked={filters.stops.nonStop}
						onChange={() => handleFilterChange("nonStop")}
					>
						Без пересадок
					</Checkbox>
					<Checkbox
						checked={filters.stops.oneStop}
						onChange={() => handleFilterChange("oneStop")}
					>
						1 пересадка
					</Checkbox>
					<Checkbox
						checked={filters.stops.twoStops}
						onChange={() => handleFilterChange("twoStops")}
					>
						2 пересадки
					</Checkbox>
					<Checkbox
						checked={filters.stops.threeStops}
						onChange={() => handleFilterChange("threeStops")}
					>
						3 пересадки
					</Checkbox>
				</div>
			</div>

			<div className="tickets__group">
				{filteredTickets.map((ticket, index) => (
					<div key={index} className="tickets__list">
						<Card>
							<div className="tickets__info">
								<div className="tickets__price">
									<img
										src={
											carrierImages[
												ticket.carrier as keyof typeof carrierImages
											]
										}
										alt={ticket.carrier}
									/>

									<Button type="primary" className="tickets__buy">
										Купить {convertCurrency(ticket.price, selectedCurrency)}{" "}
										{selectedCurrency}
									</Button>
								</div>
								<div className="tickets__time">
									<div>
										<p className="tickets__times">{ticket.departure_time}</p>
										<p>
											{ticket.origin},{ticket.origin_name}
										</p>
										<p>{ticket.departure_date}</p>
									</div>
									<div>
										<div>
											<p>
												{ticket.stops === 0
													? "Без пересадок"
													: `${ticket.stops} ${
															ticket.stops === 1 ? "пересадка" : "пересадки"
													  }`}
											</p>
											<img src={carrierImages.Arrow} alt="Arrow" />
										</div>
									</div>
									<div>
										<p className="tickets__times">{ticket.arrival_time}</p>
										<p>
											{ticket.destination},{ticket.destination_name}
										</p>
										<p>{ticket.arrival_date}</p>
									</div>
								</div>
							</div>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}

export default TicketList;
