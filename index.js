const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
var satelize = require('satelize');

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.static('views/public'))

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: false}))

const con = mysql.createConnection({
    host: "152.70.72.91",
    user: "root",
    password: "@123Chaitu",
    database: "leads_db",
   //insecureAuth : true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', function (req, res) {
    res.sendFile('public/index.html', {root: __dirname})
})

app.get('/en-us', function (req, res) {
    res.sendFile('public/index.html', {root: __dirname})
})

app.get('/leads', function (req, res) {
    con.query("select id, Name, Email, Company, Subject, Message, DATE_FORMAT(Created_at, '%D %M %y at %h:%i') AS created , country_code AS Country from leads ORDER BY id DESC;", function (err, result, fields) {
        if (err) throw err;
            res.render('leads',{title : 'all leads', items : result})
       // console.log(result);
    });
})

app.get('/views', function (req, res) {
    con.query("select id, Ipaddress, country_code AS Country,  DATE_FORMAT(Created_at, '%D %M %y at %h:%i') AS created from views ORDER BY id DESC;", function (err, result, fields) {
        if (err) throw err;
        res.render('views',{title : 'all views', items : result})
       // console.log(result);
    });
})

app.post('/submit', function (req, res){

    // console.log(req.body)

    satelize.satelize({ip: req.body.userIp }, function (err, payload){
        // console.log(payload)

        const sql = "INSERT INTO leads (Name, Email, Company, Subject, Message, Ipaddress, country_code, userInfo ) VALUES ('" + req.body.name + "' , '" + req.body.email + "' , '" + req.body.company + "' , '" + req.body.subject + "' , '" + req.body.message + "' , '" +  req.body.userIp + "' , '" +  payload.country_code + "' , '"  + JSON.stringify(payload) + "')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 lead record inserted");
        });
    })
    res.sendFile('public/response.html', {root: __dirname})

    // res.redirect('https://end.chaitu.net/')
})

app.post('/en-us', function (req, res){

    console.log(req.body)

    satelize.satelize({ip: req.body.userIp }, function (err, payload){
        // console.log(payload)
        const sql = "INSERT INTO views (Ipaddress, country_code, userInfo ) VALUES ('" + req.body.userIp + "' , '" +  payload.country_code + "' , '"  + JSON.stringify(payload) + "')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 view record inserted");
        });
    })
    res.sendFile('public/chaitu.html', {root: __dirname})

})


app.listen(process.env.PORT || port, () => {
    console.log(`leads app listening at http://localhost:${port}`)
})
