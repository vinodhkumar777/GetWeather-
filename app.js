const express=require("express");
const https=require("https");
const path=require("path");
const bodyParser= require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})

app.post("/",function(req,res){//this is the response from the post request made
   
    const city=req.body.city;
    if(city==""){
        return res.send("city can not be empty")
    }
    const query=city;
    const apiid="414e0cdd9f5992e5bffa4c1e4c54a245";
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiid+"&units="+unit;
    https.get(url,function(response){//this is the response from the API 
        //200 response code is good sign
        response.on("data",function(data){
            //console.log(typeof(data));
            const weather=JSON.parse(data);
           // console.log(typeof(weather));
           // console.log(weather);
            const code=weather.cod;
           // console.log(typeof(code));
            if(code==="404"){
                 const status_codeURL="https://httpstatusdogs.com/img/404.jpg";
                 //res.write("Please enter a valid city name");
                 res.send(`<img src=${status_codeURL}></img>`);
                 return res.send();
            }
            
            const temperature=weather.main.temp;
            const weatherDesc=weather.weather[0].description;
            const icon=weather.weather[0].icon;
            let imageURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            //console.log(weatherDesc);
            res.write("<h1>The temperature in "+city+" is "+temperature+"</h1>");
            res.write("The clouds are "+weatherDesc);
           // res.write(<img src=${URL} ></img>)
            res.write(`<img src=${imageURL} ></img>`)
            res.send();
        });
})

});

app.listen(3000,function(){
    console.log("server started on the port 3000");
})