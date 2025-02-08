import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import axios from "axios";
const saltRounds = 10;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
const port = 3000;
app.use(session({
  secret : "TOPSECRETWORD",
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:1000*60*60*24,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "keeper",
  password: "ujjwals@2004",
  port: 5432,
});

db.connect();
app.get("/notes",async (req,res)=>{
  const {tableName}=req.query;
  console.log(tableName);
  const result = await db.query(`SELECT * from ${tableName}`);
  const result1 = await db.query(`SELECT * from ${tableName}activetasks`);
  const result2 = await db.query(`SELECT * from ${tableName}completedtasks`);
  console.log(result.rows);
  res.status(201).json({
    message: 'Sent notes',
    item:result.rows,
    item1:result1.rows,
    item2:result2.rows
  });
})
app.post('/login',async (req,res)=>{
  console.log(req.body);
  const {username,password}=req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);

    if (result.rows.length === 0) {
      console.log("error1")
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Manually log the user in
      req.login(user, async(err) => {
        const tableName = username.replace('@', '_').replace('.', '_');
        const response =await db.query(`SELECT * FROM ${tableName}`);
        console.log(response);
        return res.status(200).json(
          { message: 'Login successful', 
            user:user,
            tableName:tableName
          });
      });
    } else {
      console.log("error");
      return res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    console.error("Error while logging in:",error);
  }
});   // Redirect on failure
app.get('/login',(req,res)=>{
  console.log("fail");
})
app.get('/profile',(req,res)=>{
  console.log(req.body);
})
app.post("/submit",async (req, res) => {
  const { title, content,tableName } = req.body;

  try {
    // Inserting the data into the database using SQL
    const result = await db.query(
      `INSERT INTO ${tableName} (title, content) VALUES ($1,$2) RETURNING *`,
      [title, content]
    );

    // Return the inserted item as a response
    res.status(201).json({
      message: 'Item successfully added',
      item: result.rows[0],  // The inserted item data
    });
  } catch (err) {
    console.error('Error inserting data', err.stack);
    res.status(500).json({ message: 'Error inserting data' });
  }
});
app.post("/submitactive",async (req, res) => {
  const { content,tableName } = req.body;

  try {
    // Inserting the data into the database using SQL
    const result = await db.query(
      `INSERT INTO ${tableName}activetasks (content) VALUES ($1) RETURNING *`,
      [content]
    );

    // Return the inserted item as a response
    res.status(201).json({
      message: 'Item successfully added',
      item: result.rows[0],  // The inserted item data
    });
  } catch (err) {
    console.error('Error inserting data', err.stack);
    res.status(500).json({ message: 'Error inserting data' });
  }
});
app.post("/submitcompleted",async (req, res) => {
  const { content,tableName } = req.body;

  try {
    // Inserting the data into the database using SQL
    const result = await db.query(
      `INSERT INTO ${tableName}completedtasks (content) VALUES ($1) RETURNING *`,
      [content]
    );

    // Return the inserted item as a response
    res.status(201).json({
      message: 'Item successfully added',
      item: result.rows[0],  // The inserted item data
    });
  } catch (err) {
    console.error('Error inserting data', err.stack);
    res.status(500).json({ message: 'Error inserting data' });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const tableName=req.query.tableName;
  try {
    console.log("hello");
    const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id]);
  
    if (result.rowCount > 0) {
      
      res.status(200).json({
        status: 'success',
        message: 'Note deleted successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Note not found',
      });
    }
  } catch (err) {
    console.error('Error deleting note:', err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting note',
    });
  }
});
app.delete("/deletetask/:id", async (req, res) => {
  const { id } = req.params;
  const tableName=req.query.tableName;
  const flag=req.query.flag;
  console.log(flag);
  try {
    console.log("hellotask"+id);
    var result;
    if(flag=="true"){
      result = await db.query(`DELETE FROM ${tableName}activetasks WHERE id = $1 RETURNING *`, [id]); 
    }
    else{
      console.log("hi");
      result = await db.query(`DELETE FROM ${tableName}completedtasks WHERE id = $1 RETURNING *`, [id]);
    }
   // const result = await db.query(`DELETE FROM ${tableName}${flag? "activetasks" : "completedtasks"} WHERE id = $1 RETURNING *`, [id]);
   // console.log(`DELETE FROM ${tableName}${flag?"activetasks":"completedtasks"} WHERE id = $1 RETURNING *`, [id])
    if (result.rowCount > 0) {
      console.log("success");
      res.status(200).json({
        status: 'success',
        message: 'Note deleted successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Note not found',
      });
    }
  } catch (err) {
    console.error('Error deleting note:', err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting note',
    });
  }
});
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  
  try {
    // Check if the email already exists in the database
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      // If the email already exists, send an appropriate response to the client
      res.status(400).send('Email already exists. Try logging in.');
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          res.status(500).send("Error hashing password");
        } else {
          // Insert the new user into the users table
          const result = await db.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
            [email, username, hash]
          );

          // Sanitize the email to create a valid table name
          const tableName = email.replace('@', '_').replace('.', '_');  // Example of sanitizing the email for table name

          // Create a new table for this user
          const query = `CREATE TABLE ${tableName} (
            id SERIAL PRIMARY KEY, 
            title VARCHAR(255) NOT NULL, 
            content TEXT NOT NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`;

          try {
            // Execute the query to create the table
            await db.query(query);
            await db.query(`
              CREATE TABLE ${tableName}activetasks (
                id SERIAL PRIMARY KEY,    
                content TEXT NOT NULL,          
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );
            `);
            
            // Create CompletedTasks table
            await db.query(`
              CREATE TABLE ${tableName}completedtasks (
                id SERIAL PRIMARY KEY,          
                content TEXT NOT NULL,       
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );
            `);
            console.log('Table created successfully!');
            
          } catch (err) {
            console.error('Error creating table:', err);
            return res.status(500).send("Error creating user-specific table");
          }

          // Get the newly created user from the result
          const user = result.rows[0];

          // Send the user data and the table name back in the response
          console.log(user);
          res.status(200).send({
            user: user,        // User details
            tableName: tableName // The dynamically created table name
          });

          // Log in the user (set up session or JWT if needed)
          req.login(user, (err) => {
            if (err) {
              console.error("Error during login:", err);
            } else {
              console.log("User logged in successfully");
            }
          });
        }
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error during registration");
  }
});
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      message:"success"
    });
  });
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    console.log(username+" "+password);
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);
passport.serializeUser((user,cb)=>{
  cb(null,user);
})
passport.deserializeUser((user,cb)=>{
  cb(null,user);
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
