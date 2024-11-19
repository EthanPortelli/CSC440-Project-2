// Import required modules
const express = require("express"); // Web framework for Node.js
const mariadb = require("mariadb"); // MariaDB client for Node.js
const bodyParser = require("body-parser"); // Middleware to parse request bodies

const app = express(); // Create an instance of Express
const port = 3000; // Define the port for the server

// Middleware for parsing URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: true })); // For form submissions
app.use(bodyParser.json()); // For JSON request bodies

// Serve static files from the "public" directory
app.use(express.static("public"));

// Set up the MariaDB connection pool
const pool = mariadb.createPool({
    host: "localhost", // Database host
    user: "testuser", // Your database username
    password: "1234", // Your database password
    database: "testdb", // The database name
    connectionLimit: 5, // Maximum number of connections in the pool
});

// API Route: Add a new user to the database
app.post("/api/add-user", async (req, res) => {
    const { name, age } = req.body; // Extract name and age from the request body

    // Validate input
    if (!name || !age) {
        return res.status(400).send("Name and age are required"); // Return error if input is invalid
    }

    try {
        // Get a connection from the pool and execute the INSERT query
        const connection = await pool.getConnection();
        const result = await connection.query(
            "INSERT INTO users (name, age) VALUES (?, ?)",
            [name, age]
        );
        connection.release(); // Release the connection back to the pool

        res.status(201).send(`User added with ID: ${result.insertId}`); // Respond with the new user's ID
    } catch (err) {
        // Handle database errors
        res.status(500).send("Error adding user: " + err.message);
    }
});

// Serve the frontend (HTML file)
app.get("/", (req, res) => {
    // Serve the index.html file when the root URL is accessed
    res.sendFile(__dirname + "/public/index.html");
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Log a message when the server starts
});
