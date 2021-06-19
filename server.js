const express = require('express');
const bodyParser= require('body-parser');
const app = express();
var multer = require('multer');
var path = require('path');
const mysql = require('mysql');
const DIR = './resources/images';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'userdb'
});

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage}).array('pic',5);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) 
{ 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); 
  next(); 
});

app.use(express.static('resources/images'));


app.post('/imageUpload',upload,(req, res) => {
      var name=req.body.name;
      var email=req.body.email;
      var phone=req.body.phone;
      var gender=req.body.gender;
      var education=req.body.education;
      var hobby=req.body.hobby;
      var experience=req.body.experience;
      // var pic = req.body.pic;
      var message = req.body.message;

    if (!req.files) {
        console.log("No file received");
        res.json({'msg': 'Error! in image upload!', 'file': req.files});
      } else {
        console.log('file received');
        var pic=[];
        for(var i=0; i<req.files.length;i++)
        {
          pic.push(req.files[i].filename); 
        }
        
        var sql = "INSERT INTO usertb(name,email,phone,gender,education,hobby,experience,pic,message)VALUES('" + name + "','"+email+"','"+phone+"','"+gender+"','"+education+"','"+hobby+"','"+experience+"','"+pic[0]+"','"+message+"')";
            
        let query = conn.query(sql, (err, results) => {
          if(err) throw err;
          res.send({status:1,msg: 'Successfully! uploaded!', file: req.files});
        });
     } 
  });
  
  
//update user data 

app.put('/updatUser/:id',upload,(req, res) => {
  var name=req.body.name;
  var email=req.body.email;
  var phone=req.body.phone;
  var gender=req.body.gender;
  var education=req.body.education;
  var hobby=req.body.hobby;
  var experience=req.body.experience;
  var message = req.body.message;

if (!req.files) {
    console.log("No file received");
    res.json({'msg': 'Error! in image upload!', 'file': req.files});
  } else {
    console.log('file received');
    var pic=[];
    for(var i=0; i<req.files.length;i++)
    {
      pic.push(req.files[i].filename); 
    }
    
    let sql = "UPDATE usertb SET name='"+req.body.name+"', email='"+req.body.email+"' WHERE userid="+req.params.id;  
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send({status:1,msg: 'Successfully! updated uploaded!', file: req.files});
    });
 } 
});


  app.get('/getUsers/:id',(req,res)=>{
    let sql = "SELECT * FROM usertb limit "+req.params.id+"";
    let query = conn.query(sql, (err, results) => {  
      if(err) throw err;
      res.send(JSON.stringify({status: 1,msg:'successfully get Property Images',data: results}));
    });
  });

  app.get('/getUser/:id',(req,res)=>{
    let sql = "SELECT * FROM usertb where userid = "+req.params.id+"";
    let query = conn.query(sql, (err, results) => {  
      if(err) throw err;
      res.send(JSON.stringify({status: 1,msg:'successfully get Property Images',data: results}));
    });
  });

  //Delete
app.delete('/user/:id',(req, res) => {
  let sql = "DELETE FROM usertb WHERE userid="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


  
//server listening  
app.listen(3002,()=>{
    console.log('Server started on port 3002..');
});