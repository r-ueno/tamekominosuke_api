const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

const path = require('path')

const port = 3000

// パラメータ受け取り用
app.use(bodyParser.urlencoded({
    extended: true
}));

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

// 勤怠貯之助_参照API
app.get('/v1/tamekomi/select', (req, res) => {
    const selectUser = req.query.user
    const entryDate = req.query.entryDate
    if (!selectUser) {
        console.log('userが指定されていないよ！')
        return res.send(false)
    }

    
    // 登録日が指定されている場合その日のみ取得
    if (entryDate) {
        // 年/月/日の形式のみ許容する
        if(!entryDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)){
            console.log('entryDateの形式が違うよ！ YYYY/MM/DDでいれてね')
            return res.send(false)
        }
        // 日付変換された日付が入力値と同じ事を確認
        // new Date()の引数に不正な日付が入力された場合、相当する日付に変換されてしまうため
        // 
        var date = new Date(entryDate);  
        if(date.getFullYear() !=  entryDate.split("/")[0] 
            || date.getMonth() != entryDate.split("/")[1] - 1 
            || date.getDate() != entryDate.split("/")[2]
        ){
            console.log('entryDateが日付として存在しないよ！')
            return res.send(false)
        }
        
        const sql = "select * from attendance where user = ? and entry_date = ?"
        con.query(sql, [selectUser,entryDate], function (err, result, fields) {  
            if (err) {
                console.log(err)
                console.log('selectに失敗しました')
                return res.send(false)
            }
            res.send(result)
            });
    } else {
        const sql = "select * from attendance where user = ? "
        con.query(sql, selectUser, function (err, result, fields) {  
            if (err) {
                console.log(err)
                console.log('selectに失敗しました')
                return res.send(false)
            }
            res.send(result)
            });
    }
});

// 勤怠貯之助_登録API
app.post('/v1/tamekomi/create', (req, res) => {
	const sql = "INSERT INTO attendance SET ?"

	con.query(sql,req.body,function(err, result, fields){
		if (err) {
            console.log(err)
            console.log('insertに失敗しました')
            return res.send(false)
        }
        console.log(result);
        console.log('insertに成功しました')
		res.send(true);

	});
});


// insertテスト用
app.get('/insertForm', (req, res) => 
	res.sendFile(path.join(__dirname, 'form.html')))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))