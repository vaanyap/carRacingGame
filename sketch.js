var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player, game;
var playerCount;
var gameState = 0;
var car1Img, car2Img,  track;
var car1, car2, cars;
var allPlayers;
var gold, fuelImg;
var fuelGroup, goldGroup;
var obstacles;
var obstacle1, obstacle2;
var boom;
var lifeImage;





function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage('./assets/car1.png');
  car2Img = loadImage('./assets/car2.png');
  track = loadImage('./assets/track.jpg');
  gold = loadImage('./assets/goldCoin.png');
  fuelImg = loadImage('./assets/fuel.png');
  obstacle1 = loadImage('assets/obstacle1.png');
  obstacle2 = loadImage('assets/obstacle2.png');
  boom = loadImage('assets/blast.png');
  lifeImage = loadImage('assets/life.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();


}

function draw() {
  background(backgroundImage);
  if(playerCount ==2 ){
    game.updateState(1)
  }
  if(gameState ==1){
    game.play();
  }

  if(gameState ==2){
    game.showLeaderBoard();
    game.end();
  }



}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

