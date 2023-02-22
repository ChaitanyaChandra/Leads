const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var satelize = require('satelize');
var AWS = require("aws-sdk");
var child_process = require("child_process")

let user = "chaitu"
let password = "@123Chaitu"

var Leads_table_name = "chaitu-dynamodb-nonpord-ap-south-1-dev-leads"
var Views_table_name = "chaitu-dynamodb-nonpord-ap-south-1-dev-views"

let awsConfig = {
    "region": "ap-south-1",
    "endpoint": "http://dynamodb.ap-south-1.amazonaws.com",
    "accessKeyId": "AKIAQKE37JABQYUKU4WO",
    "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

const app = express()
const port = 80

app.use(express.static('public'))
app.use(express.static('views/public'))

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({
    extended: false
}))


app.get('/', function(req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    })
})

app.get('/en-us', function(req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    })
})

app.post('/submit', function(req, res) {

    // console.log(req.body)
    satelize.satelize({
        ip: req.body.userIp
    }, function(err, payload) {
        // console.log(payload)
        var input = {
            "Created_on": new Date().toString(),
            "Name": req.body.name,
            "Email": req.body.email,
            "Company": req.body.company,
            "Subject": req.body.subject,
            "Message": req.body.message,
            "Ipaddress": payload.ip,
            "Country_code": payload.country_code,
            "UserInfo": JSON.stringify(payload)
        };

        var params = {
            TableName: Leads_table_name,
            Item: input
        };
        docClient.put(params, function(err, data) {

            if (err) {
                console.log("users::save::error - " + JSON.stringify(err, null, 2));
            } else {
                console.log("users::save::success");
            }
        });
    })
    res.sendFile('public/response.html', {
        root: __dirname
    })

    // res.redirect('https://end.chaitu.net/')
})

app.post('/en-us', function(req, res) {

    //console.log(req.body)

    satelize.satelize({
        ip: req.body.userIp
    }, function(err, payload) {
        var input = {
            "Created_on": new Date().toString(),
            "Country_code": payload.country_code,
            "Ipaddress": payload.ip,
            "UserInfo": JSON.stringify(payload)
        };

        var params = {
            TableName: Views_table_name,
            Item: input
        };
        docClient.put(params, function(err, data) {

            if (err) {
                console.log("users::save::error - " + JSON.stringify(err, null, 2));
            } else {
                console.log("users::save::success");
            }
        });
    })
    res.sendFile('public/chaitu.html', {
        root: __dirname
    })

})

app.get('/leads', function(req, res) {
    res.sendFile('public/LeadsLogin.html', {
        root: __dirname
    })
})

app.post('/leads', function(req, res) {
    if ((user == req.body.username) && (password == req.body.password)) {
        var params = {
            TableName: Leads_table_name,
            // FilterExpression: "#Created_on = :user_status_val",
            // ExpressionAttributeNames: {
            //     "#Created_on": "Created_on",
            // },
            // ExpressionAttributeValues: { ":user_status_val": 'Mon Mar 21 2022 20:26:37 GMT+0530 (India Standard Time)' }
        };

        docClient.scan(params, onScan);
        var count = 0;

        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                data.Items.forEach(function(itemdata) {
                    console.log("Item :", ++count, JSON.stringify(itemdata));
                });
                console.log(data)
                res.render('leads', {
                    title: 'all leads',
                    items: data.Items
                })

                // continue scanning if we have more items
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }
            }
        }
    } else {
        res.sendFile('public/LeadsLogin.html', {
            root: __dirname
        })
    }
})

app.get('/views', function(req, res) {
    res.sendFile('public/ViewsLogin.html', {
        root: __dirname
    })
})

app.post('/views', function(req, res) {
    if ((user == req.body.username) && (password == req.body.password)) {
        var params = {
            TableName: Views_table_name,
            // FilterExpression: "#Created_on = :user_status_val",
            // ExpressionAttributeNames: {
            //     "#Created_on": "Created_on",
            // },
            // ExpressionAttributeValues: { ":user_status_val": 'Mon Mar 21 2022 20:26:37 GMT+0530 (India Standard Time)' }
        };


        docClient.scan(params, onScan);
        var count = 0;

        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                data.Items.forEach(function(itemdata) {
                    console.log("Item :", ++count, JSON.stringify(itemdata));
                });
                console.log(data.ScannedCount)
                res.render('views', {
                    title: 'all views',
                    items: data.Items
                })

                // continue scanning if we have more items
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }
            }
        }
    } else {
        res.sendFile('public/ViewsLogin.html', {
            root: __dirname
        })
    }
})


// error navigation
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
    res.sendFile('public/error.html', {
        root: __dirname
    })
});

app.get('/health', (req, res) => {
    var stat = {
        status: 'OK',
        status_code: 200,
        host_name: child_process.execSync("hostname").toString()
    };
    res.json(stat);
});

app.use(function(req, res, next){
    res.status(404);
    res.sendFile('public/error.html', {
        root: __dirname
    })
})

app.listen(process.env.port || port, () => {
    console.log(`leads app listening at http://localhost:${port}`)
})
