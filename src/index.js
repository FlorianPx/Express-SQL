const express = require("express");
const wizard = require("./wizard");
const connection = require("./config");
const { query } = require("express");

const port = 3000;
const app = express();

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to my favorite wizard list");
});

app.get("/api/wizard-list", (req, res) => {
  connection.query("SELECT * FROM wizard", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/wizard", (req, res) => {
  connection.query(
    "SELECT id, firstname, lastname, birthday FROM wizard",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/wizard/:id", (req, res) => {
  connection.query(
    "SELECT * from wizard WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/wizard/weasley", (req, res) => {
  connection.query(
    "SELECT * FROM wizard WHERE lastname='Weasley'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/wizard/pot", (req, res) => {
  connection.query(
    "SELECT * FROM wizard WHERE lastname LIKE '%Pot%'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/wizard-date", (req, res) => {
  connection.query(
    "SELECT * FROM wizard WHERE birthday > '1980-01-01'",

    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/wizard-order", (req, res) => {
  connection.query(
    "SELECT * FROM wizard ORDER BY firstname ASC",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.post("/api/wizard", (req, res) => {
  const {
    firstname,
    lastname,
    birthday,
    birth_place,
    biography,
    uses_brooms,
  } = req.body;
  connection.query(
    "INSERT INTO wizard (firstname, lastname, birthday, birth_place, biography, uses_brooms) VALUES (?, ?, ?, ?, ?, ?)",
    [firstname, lastname, birthday, birth_place, biography, uses_brooms],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving Wizard");
      } else {
        res.status(200).send("Wizard successfully saved");
      }
    }
  );
});

app.put("/api/wizard/:id", (req, res) => {
  const idWizard = req.params.id;
  const newWizard = req.body;
  connection.query(
    "UPDATE wizard SET ? WHERE id = ?",
    [newWizard, idWizard],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("Wizard successfully updated 🎉");
      }
    }
  );
});

app.put("/api/wizard/:uses_brooms", (req, res) => {
  const idBoolean = req.params.uses_brooms;
  const newBoolean = req.body;
  connection.query(
    "UPDATE wizard SET uses_brooms = ABS(uses_brooms - 1) WHERE uses_brooms = 2",
    [newBoolean, idBoolean],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating boolean");
      } else {
        res.status(200).send("Boolean successfully modified 🎉");
      }
    }
  );
});

app.delete("/api/wizard/:id", (req, res) => {
  const idWizard = req.params.id;
  connection.query(
    "DELETE FROM wizard WHERE id = ?",
    [idWizard],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting Wizard");
      } else {
        res.status(200).send("🎉 Wizard deleted!");
      }
    }
  );
});

app.delete("/api/delete/wizard", (req, res) => {
  connection.query(
    "DELETE FROM wizard WHERE uses_brooms = 0",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting Wizards without brooms");
      } else {
        res.status(200).send("🎉 Wizards without brooms deleted!");
      }
    }
  );
});
