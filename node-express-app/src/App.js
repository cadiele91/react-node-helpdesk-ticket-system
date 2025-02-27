import { useEffect, useState } from "react";
import { fetchAllTickets } from './service/ticketService';

function App() {
  const [tickets, setTickets] = useState([]);

  // Define the function inside the component
  const getAllTickets = async () => {
    const ticketsData = await fetchAllTickets();
    console.log(ticketsData);  // Log the data to debug what is being returned
    setTickets(ticketsData);
  };

  // Use useEffect to call it when the component mounts
  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <div className="App">
      <h1>Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        tickets.map((ticket, index) => (
          <div key={index}>
            <p>{ticket.id}</p>
            <p>{ticket.summary}</p>
            <p>{ticket.priority}</p>
            <p>{ticket.status}</p>
            <p>{ticket.create_date}</p>
            <p>{ticket.update_date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
