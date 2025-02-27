export const fetchAllTickets = async () => {
    const rawResponse = await fetch("http://localhost:3001/all");
    return await rawResponse.json();
  };