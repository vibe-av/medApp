const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/meds', (req,res)=>{
    const client = new Client({
        "user": 'postgres',
        "database": 'medical',
        "host": 'localhost',
        "password": '34892',
        "port": 5432,
    });

client.connect()

    .then(()=>{

        return client.query('SELECT * FROM medicines')
    
    })
    .catch(error => console.log("error 2"))

    .then((results)=>{
        console.log('results', results);
        res.render('meds', results);
    })

    .catch(error => console.log("2. error2"))

});

app.get('/add', (req,res)=>{
    res.render('medsForm');
});

app.post('/meds/add',(req,res)=>{
    const client = new Client({
        "user": 'postgres',
        "database": 'medical',
        "host": 'localhost',
        "password": '34892',
        "port": 5432,
    });

client.connect()

    .then(()=>{
        console.log('connection completed!');

        const sql = 'INSERT INTO medicines (name, count, brand) VALUES ($1, $2, $3)';
        const params = [req.body.name, req.body.count, req.body.brand]; // 'sensu beans', '50', 'dbz'
        return client.query(sql, params);
    })
    .catch(error => console.log("error 1"))

    .then((result)=>{
        console.log('result', result);
        res.redirect('/meds');
    })

    .catch(error => console.log("1. galt h bai.!!"))
});

app.post('/meds/delete/:id', (req, res)=>{
    const client = new Client({
        "user": 'postgres',
        "database": 'medical',
        "host": 'localhost',
        "password": '34892',
        "port": 5432,
    });

client.connect()

    .then(()=>{
        const sql = 'DELETE FROM medicines WHERE mid = $1'
        const params = [req.params.id];

        return client.query(sql,params);
    })
    .catch(error => console.log("3.error 1"))

    .then((results)=>{
        res.redirect('/meds');
    })

    .catch(error => console.log("3. error2"))

});

app.get('/meds/edit/:id', (req, res)=>{
    const client = new Client({
        "user": 'postgres',
        "database": 'medical',
        "host": 'localhost',
        "password": '34892',
        "port": 5432,
    });

 client.connect()

    .then(()=>{
        
        const sql = 'SELECT * FROM medicines WHERE mid = $1';
        const params = [req.params.id];
        return client.query(sql, params);
    })

    .then((results)=>{
        console.log('results', results);
        res.render('editForm', {med:results.rows[0]});
    })
});


app.post('/meds/edit/:id', (req, res)=>{
    const client = new Client({
        "user": 'postgres',
        "database": 'medical',
        "host": 'localhost',
        "password": '34892',
        "port": 5432,
    });

 client.connect()

    .then(()=>{
        
        const sql = 'UPDATE medicines SET name=$1, count=$2, brand=$3 WHERE mid=$4';
        const params = [req.body.name, req.body.count, req.body.brand, req.params.id];
        return client.query(sql, params);
    })

    .then((results)=>{
        console.log('results', results);
        res.redirect('/meds');
    })
});

app.listen(5001,()=>{
    console.log('server is now connected to port 5001');
});

