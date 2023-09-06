import "./App.css";
import TicketList from "./components/TicketList";
import ticketsData from "./tickets.json";

function App() {
	return (
		<div className="App">
			<main>
				<TicketList tickets={ticketsData.tickets} />
			</main>
		</div>
	);
}

export default App;
