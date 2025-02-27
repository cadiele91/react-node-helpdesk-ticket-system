import { useEffect, useState } from "react";
import "./App.css"
import { createTicket, fetchAllTickets } from './service/ticketService';
import TicketForm from "./component/TicketForm/TicketForm";

function App() {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState({});

  // Define the function inside the component
  const getAllTickets = async () => {
    const ticketsData = await fetchAllTickets();
    console.log(ticketsData);  // Log the data to debug what is being returned
    setTickets(ticketsData);
  };

  const sendCreateRequest = async (id,
    summary,
    priority,
    status,
    create_date,
    update_date
  ) => { 
    const createdTicket = await createTicket({
    id,
    summary,
    priority,
    status,
    create_date,
    update_date
    })
    
    if(!createdTicket){
      return;
    }

    getAllTickets();
    setCurrentTicket(createdTicket);
  };


  // Use useEffect to call it when the component mounts
  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <div className="App">
      <TicketForm
          id={currentTicket.id}
          summary={currentTicket.summary}
          priority={currentTicket.priority}
          status={currentTicket.status}
          createDate={
            currentTicket.create_date
              ? new Date(currentTicket.create_date)
              : new Date()
          }
          updateDate={
            currentTicket.update_date
              ? new Date(currentTicket.update_date)
              : new Date()
          }
          readonly={false}
          onSubmit={sendCreateRequest}
        />
      <h1>Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        tickets.map((ticket, index) => (
          <div key={index} style={{border: '1px solid black'}} >
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
