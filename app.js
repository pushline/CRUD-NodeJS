const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')
const app = express()

const urlencodeParser = bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:'3306'

})
sql.query('use nodejs');


// motor da template
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// diretorios pra colocar no handle bars
app.use('/css', express.static('css'));
app.use('/js', express.static('js'))
app.use('/img', express.static('img'))

// rotas e templates

app.get("/", function(req,res){
   // res.send('Teste')
   // res.sendFile(__dirname+"/index.html")
   // console.log(req.params.id)  
   res.render('index'); 
})

//inserir dados sql
app.get("/inserir", function(req,res){
    res.render('inserir')
})

app.post("/controllerForm", urlencodeParser, function(req,res){
    sql.query('insert into user values (?,?,?)', 
    [req.body.id,req.body.name, req.body.age]);
    res.render('controllerForm', {name:req.body.name});
})

// listar dados sql
app.get("/select/:id?", function(req,res){
    if(!req.params.id){
        sql.query("select * from user order by id asc",function(err,results,fields){
           res.render('select',{data:results});
        });
    }else{
        sql.query("select * from user where id=? order by id asc",[req.params.id],function(err,results,fields){
            res.render('select',{data:results});
        });
    }
})

// deletar dados sql
app.get("/deletar/:id", function(req,res){
    sql.query("delete from user where id = ?", [req.params.id]);
    res.render('deletar')
})


// atualizar
app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
    });
});
app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
   res.render('controllerUpdate');
});

// iniciar
app.listen(3000, function(req,res){
    console.log('online')
})
