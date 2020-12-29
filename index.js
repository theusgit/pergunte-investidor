const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//conexão com o bd
const connection=require("./database/database");

//chamando database
connection.authenticate()
.then(()=>{console.log("conexão feita")
})
.catch((msgErro)=>{
    console.log(msgErro)
})



app.set('view engine','ejs');
app.use(express.static('public'));
//bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.get("/",(req, res)=>{
    Pergunta.findAll({raw:true, order:[
        ['id','DESC']//crescente ASC
    ]}).then(perguntas=>{
        res.render("index",{
            perguntas:perguntas
        });
    });
    

});

app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});

app.post("/salvarpergunta",(req,res)=>{
    var titulo=req.body.titulo;
    var descricao=req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao:descricao
    }).then(()=>{
        res.redirect("/")
    })
});

app.delete("/pergunta-delete/:id",(req,res)=>{
    Pergunta.destroy({
        where:{id:req.params.id}
    }).then(()=>{
        res.redirect("http://localhost:8888")
    })
})


app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id
    Pergunta.findOne({
        where: {id:id}
    }).then(pergunta=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where:{perguntaId:pergunta.id},
                order:[['id','DESC']]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas: respostas
                });
            });



            
        }else{
            res.redirect("/")
        }
    })
});

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    if(!corpo){
        res.send("Você precisa digitar no campo").then(()=>{
            res.redirect("/pergunta/"+perguntaId);
        });
    }else{

    Resposta.create({
        corpo:corpo,
        perguntaId:perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    });
    }
});




app.listen(8888,()=>{
    console.log("Rodando");
});

