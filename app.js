//1. invocamos a express
const express =require('express')
const app= express();

// invocmaos a consolidate
var cons = require('consolidate');


// 2. seteamos urlenconded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//3. invocamos dotenv
const dontenv=require('dotenv')
dontenv.config({path:'./env/.env'})

//4. El directorio public
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));
//console.log(__dirname);


//5. establecer motor de plantillas
// view engine setup
const path=require('path')
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//------------------------------------------------------------------
//6. invocamos a bcryptjs--- Hassing del password
const bcryptjs = require('bcryptjs')

//7. Variables de session
const session=require('express-session');
const req = require('express/lib/request');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));



/// 8.  Invocamos al modulo de conexion de la base de datos
const connection= require('./database/db');
const { response } = require('express');

//9. Estableciendo  RUTAS



app.get('/',(req,res)=>{
    
    res.render('index',{msg:'Esto es un mensaje desde Nodejs'})
    
    //Si quisieramos hacerlo con HTML
    //res.sendFile(path.resolve(__dirname,'./views/index.html'))
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/portal',(req,res)=>{
    res.render('portal')
})

app.get('/forgot_password',(req,res)=>{
    res.render('forgot_password')
})



//10.  Creacion de usuario
app.post('/register',async (req,res)=>{
    const user=req.body.user;
    const name=req.body.name;
    const email=req.body.email;
    const rol=req.body.rol;
    const pass=req.body.pass;

    //hashing passwords- encriptarla
    let passwordHaash=await bcryptjs.hash(pass,8);

    connection.query('INSERT INTO users SET ?',{user:user,name:name,email:email,rol:rol,pass:passwordHaash} , async(error,results)=>{
        if(error){
            console.log(error)
        }else{
            console.log('Creacion de usuario Exitosa')
            res.render('register',{
                alert:true,
                alertTitle:"Registration",
                alertMessage:"¡Successful registration!",
                alertIcon:"success",
                showConfirmButton:false,
                timer:2500,
                ruta:""
            })

        }
    })
});


//11. autenticacion - login
app.post('/auth',async (req,res)=>{
    const user=req.body.user;
    const pass=req.body.password;
    let passwordHaash=await bcryptjs.hash(pass,8);

    if(user && pass ){
        connection.query("SELECT * from users WHERE user=? ",[user],async(error,results)=>{
            if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pass))){
                //res.send("Usuario o password incorrectos");
                res.render("login",{
                    alert:true,
                    alertTitle:"Error",
                    alertMessage:"Login fallido, usuario y/o password incorrecto.",
                    alertIcon:"error",
                    showConfirmButton:true,
                    timer:false,
                    ruta:"login"
                })
            }else{
                req.session.loggedin=true
                req.session.name=results[0].name                
                res.render("portal",{
                    alert:true,
                    alertTitle:"Login Exitoso",
                    alertMessage:"Acceso otorgado",
                    alertIcon:"success",
                    showConfirmButton:false,
                    timer:2500,
                    ruta:"portal"
                })
            }
        })
    }else{
        
        res.render("login",{
            alert:true,
            alertTitle:"Error",
            alertMessage:"Por favor ingrese un usuario y una contraseña",
            alertIcon:"error",
            showConfirmButton:true,
            timer:false,
            ruta:"login"
        })
    }
       
});


//12. autenticacion en otras paginas
/*
app.get("/",(req,res)=>{
    if(req.session.loggedin){
        res.render("portal",{
            login:true,
            name:req.session.name
        });
    }else{
        res.render("portal",{
            login:false,
            name:"Por favor inicie sesion"
        })
    }
})
*/




//-----------------------------------------------------

app.listen(3000, (req,res)=>{
    console.log("SERVER RUNNING in http://localhost:3000");
})