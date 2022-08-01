// Importing modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/dbconn');
const {genSalt, hash} = require('bcrypt');
// Express app
const app = express();
// Express router
const router = express.Router();
// Configuration 
const port = parseInt(process.env.Port) || 3000;
app.use(router, cors(), express.json(), express.urlencoded({
    extended: true
}));

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

// User registration
router.post('/register', bodyParser.json(), async (req, res)=> {
    const bd = req.body; 
    // Encrypting a password
    // Default genSalt() is 10
    bd.userpassword = await hash(bd.userpassword, 10);
    // Query
    const strQry = 
    `
    INSERT INTO users(firstname, lastname, gender, address, email, userpassword)
    VALUES(?, ?, ?, ?, ?, ?);
    `;
    //
    db.query(strQry, 
        [bd.firstname, bd.lastname, bd.gender, bd.address, bd.email, bd.userpassword],
        (err, results)=> {
            if(err) throw err;
            res.send(`number of affected row/s: ${results.affectedRows}`);
        })
});
// Login
router.post('/login', bodyParser.json(), (req, res)=> {
    const strQry = 
    `
    SELECT firstname, gender, email, userpassword
    FROM users;
    `;
    db.query(strQry, (err, results)=> {
        if(err) throw err;
        res.json({
            status: 200,
            results: results
        })
    })
/*
Have to compare: 
compare(req.body.userpassword, results.userpassword)
======
require('crypto').randomBytes(64).toString('hex')
*/
})

// Create new products
router.post('/products', bodyParser.json(), (req, res)=> {
    const {prodName, prodUrl, quantity, price,totalamount, dateCreated} = req.body; 
    totalamount = quantity * price;
    // Query
    const strQry = 
    `
    INSERT INTO products(prodName, prodUrl, quantity, price, dateCreated)
    VALUES(?, ?, ?, ?, ?);
    `;
    //
    db.query(strQry, 
        [prodName, prodUrl, quantity, price, totalamount, dateCreated],
        (err, results)=> {
            if(err) throw err;
            res.send(`number of affected row/s: ${results.affectedRows}`);
        })
});
// Get all products
router.get('/products', (req, res)=> {
    // Query
    const strQry = 
    `
    SELECT id, prodName,prodUrl, quantity, price, totalamount, dateCreated, userid
    FROM products;
    `;
    db.query(strQry, (err, results)=> {
        if(err) throw err;
        res.json({
            status: 200,
            results: results
        })
    })
});

// Get one product
router.get('/products/:id', (req, res)=> {
    // Query
    const strQry = 
    `
    SELECT id, prodName, prodUrl, quantity, price, totalamount, dateCreated, userid
    FROM products
    WHERE id = ?;
    `;
    db.query(strQry, [req.params.id], (err, results)=> {
        if(err) throw err;
        res.json({
            status: 200,
            results: (results.length <= 0) ? "Sorry, no product was found." : results
        })
    })
});
// Update product
router.put('/products', bodyParser.json(), (req, res)=> {
    const bd = req.body;
    // Query
    const strQry = 
    `UPDATE products
     SET ?
     WHERE id = ?`;

    db.query(strQry,[bd.id], (err, data)=> {
        if(err) throw err;
        res.send(`number of affected record/s: ${data.affectedRows}`);
    })
});

// Delete product
router.delete('/clinic/:id', (req, res)=> {
    // Query
    const strQry = 
    `
    DELETE FROM products 
    WHERE id = ?;
    `;
    db.query(strQry,[req.params.id], (err, data, fields)=> {
        if(err) throw err;
        res.send(`${data.affectedRows} row was affected`);
    })
});
/*
res.status(200).json({
    status: 200,
    results: results
})
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = parseInt(process.env.PORT) || 4040;
// Create a router
const router = express.Router();
// Data
let courses = [
    {
        id: 1, name: 'Software Engineering'
    },
    {
        id: 2, name: 'Web Development'
    },
    {
        id: 3, name: "Database Management"
    }
];
app.use(router, cors(), express.json(),
    express.urlencoded({
        extended: true
    })
);
app.listen(port);
router.get('^/$|/courses', (req, res)=> {
    res.send(courses);
});
router.get('/courses/:id', (req, res)=> {
    const index = parseInt(req.params.id) - 1;
    if(index < courses.length) {
        res.status(200).json(
            {result: courses[index]}
        );
    }else {
        res.status(404).json(
            {result: 'Resources was not found'}
        );
    }
});
//
router.post('/courses', bodyParser.json(), (req, res)=> {
    const bd = req.body;
    courses.push(
        {
            id: bd.id, name: bd.name
        }
    )
    res.status(200).json(
        {result: courses}
    );
});