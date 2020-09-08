//Create variables here
var dog, sleepydog, dogImg, happyDog, database, foodS, foodStock;
var feedpet, addfood, fedTime, lastFed, foodObj,food,currentTime;
var gardenimg, bedroomimg, washroomimg;
var readgamestate;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  gardenimg = loadImage("images/Garden.png");
  bedroomimg = loadImage("images/Living Room.png");
  washroomimg = loadImage("Wash Room.png");
}

function setup() {
  database = firebase.database();
  
  createCanvas(500,500);
  dog = createSprite(250,250, 10,10);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodstock = database.ref('Food/stock');
  foodstock.on("value", readStock, showerror);

  food = new Food();

  feedpet = createButton("Feed The Dog");
  feedpet.position(700,95);
  feedpet.mousePressed(feedDog);

  addfood = createButton("Add food");
  addfood.position(800,95);
  addfood.mousePressed(addFood);

  readgamestate = database.ref('gameState');
  readgamestate.on("value",(data)=>{
    gameState = data.val();
  });
}


function draw() {  
  background(46, 139, 87);

  
  food.display();

  fedTime = database.ref('feedtime');
  fedTime.on("value", function(data){
     lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15); 

   if(lastFed>=12){ 
     text("Last Feed : "+ lastFed%12 + " PM", 350,30); 
    }else if(lastFed==0){
       text("Last Feed : 12 AM",350,30); 
      }else{ 
        text("Last Feed : "+ lastFed + "AM", 350,30);
       } 

  currentTime = hour();
  if(currentTime === lastFed + 1){
    update("happyDog");
    foodObj.garden();

  }else if(currentTime === lastFed + 2){
    update("DogImg");
    foodObj.bedroom();

  }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("dogImg");
    foodObj.washroom();
  
  }else{
    update("dogImg");
    foodObj.display();
  }
       

  drawSprites();
  //add styles here

  

}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  database.ref('Food/').set({
    stock : x
  })
}

function showerror(){
  console.log("error connecting to database");
}

function feedDog(){ 
  dog.addImage(happyDog); 

  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    FeedTime:hour()
 })
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}