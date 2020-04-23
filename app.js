const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: '' 
})

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected')
  const sql = "select * from attendance"
	con.query(sql, function (err, result, fields) {  
	if (err) throw err;  
	console.log(result)
	});
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/v1/tamekomi/select', (request, response) => {
    const selectUser = request.query.user
    if (!selectUser) {
        console.log('not select user')
        return response.send(false)
    }
	const sql = "select * from attendance where user = ? "
	con.query(sql, selectUser, function (err, result, fields) {  
	if (err) throw err;
	response.send(result)
    });
});

app.get('/hello', (req, res) => {
    res.send('Hello ' + req.query.name);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))