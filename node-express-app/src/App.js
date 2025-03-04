import { useEffect, useState } from "react";
import "./App.css";
import {
  createTicket,
  deleteTicket,
  fetchAllTickets,
  updateTicket,
} from "./service/ticketService";
import TicketForm from "./component/TicketForm/TicketForm";
import { formatDate } from "./util/dateUtil";

function App() {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState({});

  const getAllTickets = async () => {
    const ticketsData = await fetchAllTickets();
    console.log(ticketsData);
    setTickets(ticketsData);
  };

  const sendSaveRequest = async (
    id,
    summary,
    priority,
    status,
    create_date,
    update_date
  ) => { 
    const newTicket = {
      id,
      summary,
      priority,
      status,
      create_date: formatDate(new Date(create_date)),
      update_date: formatDate(new Date(update_date)),
    };

    const savedTicket = id
      ? await updateTicket(id, newTicket)
      : await createTicket(newTicket);

    if (!savedTicket) {
      return;
    }

    getAllTickets();
    setCurrentTicket(savedTicket);
  };

  const sendDeleteRequest = async (ticket) => {
    if (!ticket?.id) {
      return;
    }

    const result = await deleteTicket(ticket.id);
    if (!result) {
      return;
    }

    getAllTickets();
    setCurrentTicket({});
  };

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
        createDate={currentTicket.create_date ? new Date(currentTicket.create_date) : new Date()}
        updateDate={currentTicket.update_date ? new Date(currentTicket.update_date) : new Date()}
        readonly={false}
        onSubmit={sendSaveRequest}  
      />
      <h1>Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        tickets.map((ticket, index) => (
          <div 
            key={index} 
            onClick={() => setCurrentTicket(ticket)}  
            style={{ border: '1px solid black' }}
          >
            <p>{ticket.id}</p>
            <p>{ticket.summary}</p>
            <p>{ticket.priority}</p>
            <p>{ticket.status}</p>
            <p>{ticket.create_date}</p>
            <p>{ticket.update_date}</p>
            <button onClick={() => sendDeleteRequest(ticket)}>Delete</button>
          </div> 
        ))
      )}
    </div>
  );
}

export default App;
