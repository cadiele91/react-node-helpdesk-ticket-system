const express = require('express');
const mysql = require('mysql2');


const app= express();
const pool = mysql.createPool({
    host: "localhost",
    database: "sqltestdb",
    user: "sqltester",
    password: "MySecret1!",
    connectionLimit: 10,
});



app.use(express.json());

app.post("/ticket", (req, res) => {
    const ticket = req.body;
    pool.query(
      "insert into ticket (summary,priority,status) value (?,?,?)",
      [ticket.summary, ticket.priority, ticket.status],
      (error, result) => {
        if (error) {
          console.error(error);
          res.send(error);
          return;
        }
  
        res.send({ ...ticket, id: result.insertId });
      }
    );
  });
  app.put("/ticket/:id", (req, res) => {
    const id = req.params.id;
    const { summary, priority, status } = req.body;

    // Check if required fields are missing
    if (!summary || !priority || !status) {
        return res.status(400).send({ error: "All fields (summary, priority, status) are required." });
    }

    pool.query(
        "UPDATE ticket SET summary = ?, priority = ?, status = ? WHERE id = ?",
        [summary, priority, status, id],
        (error, result) => {
            if (error) {
                console.error("MySQL Error:", error);
                res.status(500).send({ error: "Database error", details: error.message });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send({ error: "Ticket not found" });
                return;
            }

            res.send({ id, summary, priority, status });
        }
    );
});

  
  app.delete("/ticket/:id", (req, res) => {
    const id = req.params.id;
    pool.query("delete from ticket where id = ?", [id], (error, result) => {
      if (error) {
        console.error(error);
        res.send(error);
        return;
      }
  
      res.send({ message: "Success" });
    });
  });
  
  app.get("/all", (req, res) => {
    pool.query("select * from ticket", (error, result) => {
      if (error) {
        console.error(error);
        res.send(error);
        return;
      }
  
      res.send(result);
    });
  });
  
  app.get("/ticket/:id", (req, res) => {
    const id = req.params.id;
    pool.query("select * from ticket where id = ?", [id], (error, result) => {
      if (error) {
        console.error(error);
        res.send(error);
        return;
      }
  
      res.send(result);
    });
  });
  

app.listen(3000, () => {
    console.log('Server started on port 3000')
});