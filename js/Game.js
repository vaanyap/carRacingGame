class Game {
  constructor() {
    this.resetTitle =createElement('h2');
    this.resetButton = createButton('');
    this.leaderBoardTitle  = createElement('h1')
    this.leader1 = createElement('h2'); 
    this.leader2 = createElement('h2');
    this.movement = false;
    this.leftKey = false;
    this.blast = false;


  }
  getState(){
    var gLocation = database.ref('gameState');
    gLocation.on('value',function(data){
      gameState = data.val();
    })

  }
  updateState(state){
    database.ref('/').update({
    'gameState': state
    })
  }

  start() {
    player = new Player();
    //storing value directly in a variable
    playerCount = player.getCount();
    form = new Form();
    form.display();

    car1 = createSprite(width/2-200,height-100)
    car1.addImage(car1Img);
    car1.scale = 0.1
    car2 = createSprite(width/2+170, height-100);
    car2.addImage(car2Img);
    car2.scale = 0.1;


    car2.addImage('dead',boom);
    car1.addImage('dead',boom)
    cars = [car1, car2];

    fuelGroup = new Group();
    goldGroup = new Group();
    obstacles = new Group();

    //adding fuel sprite in the game
    this.addSprites(fuelGroup, 5,fuelImg, 0.02);

    //adding coin sprites in the game
    this.addSprites(goldGroup, 10, gold, 0.05);

    var obstaclesPositions = [
      {x:width/2+250 , y:height-800, image:obstacle2},
      {x:width/2-150 , y:height-1300, image:obstacle1},
      {x:width/2+250 , y:height-1800, image:obstacle1},
      {x:width/2-180 , y:height-2300, image:obstacle2},
      {x:width/2     , y:height-2800, image:obstacle2},
      {x:width/2-180 , y:height-3300, image:obstacle1},
      {x:width/2+180 , y:height-3300, image:obstacle2},
      {x:width/2+250 , y:height-3800, image:obstacle2},
      {x:width/2-150 , y:height-4300, image:obstacle1},
      {x:width/2+250 , y:height-4800, image:obstacle2},
      {x:width/2     , y:height-5300, image:obstacle1},
      {x:width/2-180 , y:height-5500, image:obstacle2}
    ];
    //adding obstacle Sprites in the game;
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1,0.05, obstaclesPositions);
  }
  
  addSprites(spritesGroup, numberOfSprites, spriteImg, scale, position=[]){
    for(var i =0; i<numberOfSprites; i++){
      var x,y;
      if(position.length>0){
        x = position[i].x;
        y = position[i].y;
        spriteImg = position[i].image;

      }
      else{
        x = random(width/2 + 150, width/2 - 150);
        y = random(-height*4.5, height-400);
      }
      var sprite = createSprite(x,y);
      sprite.addImage(spriteImg);
      sprite.scale = scale;
      spritesGroup.add(sprite);

    }

  }

  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
   form.titleImg.class('gameTitleAfterEffect');
  

    this.resetTitle.html('RESET GAME');
    this.resetTitle.class('resetText');
    this.resetTitle.position(width/2+200, 40);


    this.resetButton.class('resetButton');
    this.resetButton.position(width/2+230,100);

    this.leaderBoardTitle.html('LEADER BOARD');
    this.leaderBoardTitle.class('resetText');
    this.leaderBoardTitle.position(width/3-60,40);

    this.leader1.class('leadersText');
    this.leader1.position(width/3-50, 80)

    this.leader2.class('leadersText');
    this.leader2.position(width/3-50, 130);


  }
  play(){
    this.handleElements();
    //becoz a static func
    this.handleResetButton();
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers!==undefined){
      image(track,0,-height*5,width, height*6);
      this.showFuelBar()
      this.showLife()
      this.showLeaderBoard();
      var index = 0;
      for (var i in allPlayers){
        index++ ; 
        
        
        
        var x = allPlayers[i].positionX;
        var y = height - allPlayers[i].positionY;

        //saving the value of player.life in a temporary variable

        var currentLife = allPlayers[i].life
        if(currentLife<=0){
          cars[index-1].changeImage('dead');
          gameState=2;
          this.lifeOver()
        }


        cars[index-1].position.x = x;
        cars[index-1].position.y = y;
        if(index == player.index){

          stroke(1);
          fill('#39FF14')
          ellipse(x,y,90,90);


          this.handleFuel(index);
          this.hanldeGoldCoins(index)
          this.handleCarCollision(index);
          this.handleObstacleCollision(index);


          if(player.life<=0){
            {
              this.blast = true;
              this.movement = false;
            }
          }

          //changing camera's y position
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;

        }


      }
      if(this.movement){
        player.positionY+=2
        player.update();
      }
      this.handlePlayerControls();
      const finishLine = height*6 -100;
      if(player.positionY > finishLine){
        gameState=2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      
      }
      drawSprites();
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref('/').set({
       // 'carsAtEnd':0,
        'playerCount': 0,
        'gameState':0,
        'players':{},
        'CarsAtEnd':0
      })
      window.location.reload()
    })
  }

  showLeaderBoard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    console.log(players[0].name,players[0].rank);
    console.log(players[1].name, players[1].rank);
    if((players[0].rank==0 && players[1].rank==0)||(players[0].rank==1)){
      //&emsp; >> used to display 4 spaces
      leader1 = players[0].rank + '&emsp;' + players[0].name + '&emsp;' + players[0].score
      leader2 = players[1].rank + '&emsp;' + players[1].name + '&emsp;' + players[1].score
    }
    if(players[1].rank==1){
      leader1 = players[1].rank + '&emsp;' + players[1].name + '&emsp;' + players[1].score
      leader2 = players[0].rank + '&emsp;' + players[0].name + '&emsp;' + players[0].score
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

handlePlayerControls(){
  if(!this.blast){
  if(keyIsDown(UP_ARROW)){
    this.movement= true;
    player.positionY += 5;
    player.update()
  }
  if(keyIsDown(RIGHT_ARROW)&& player.positionX<width/2+300){
    this.leftKey= false;
    player.positionX += 2;
    player.update();
  }
  if(keyIsDown(LEFT_ARROW)&& player.positionX >width/3-50){
    this.leftKey= true;
    player.positionX-= 2;
    player.update()
  }
}
  
}



handleFuel(index){
  
  //adding fuel
  cars[index-1].overlap(fuelGroup,function(collector, collected){
    player.fuel = 200
    //collected: is gonna get deleted >> object of the fuel group
    collected.remove();

  })
  if(this.movement ==true && player.fuel > 0){
    player.fuel -=0.5;
  }
  if(player.fuel<=0){
    gameState = 2
    this.gameOver();
  }
}

hanldeGoldCoins(index){
  cars[index-1].overlap(goldGroup,function(collector, collected){
    player.score +=10;
    player.update()
    collected.remove();
  })

}

showRank(){
  swal({
    title:`AWESOME!${'\n'}Rank${'\n'}${player.rank}`,
    text:'YOU REACHED THE FINISH LINE SUCCESSFULLY',
    imageUrl: 'https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png',
    imageSize:'100x100',
    confirmButtonText: 'OKAY'
  })
  
}
showFuelBar(){
  push()
  image (fuelImg,width/2-120, height-player.positionY-100,20,20);
  fill("white")
  rect(width/2-100, height-player.positionY-100, 200,20);
  fill('green');
  rect(width/2-100, height-player.positionY-100, player.fuel, 20);
  noStroke();
  pop ();

}

showLife(){
  push()
  image (lifeImage,width/2-120, height-player.positionY-150,20,20);
  fill("white")
  rect(width/2-100, height-player.positionY-150, 200,20);
  fill('red');
  rect(width/2-100, height-player.positionY-150, player.life, 20);
  noStroke();
  pop ();


}

gameOver(){
  swal({
    title: `GAME OVER`,
    text: 'OOPS, YOU LOST, YOU SUCK!',
    imageUrl: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png',
    imageSize: '200x200',
    confirmButtonText: 'I SUCK'
  })

}
lifeOver(){
  swal({
    title: `GAME OVER`,
    text: 'OOPS, YOU CANNOT DRIVE!',
    imageUrl: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png',
    imageSize: '100x100',
    confirmButtonText: 'I SUCK'
  })
}

handleObstacleCollision(index){
  if(cars[index-1].collide(obstacles)){
    if(this.leftKey){
      player.positionX +=100;
    }
    else{
      player.positionX -=100;
    }

    
  
  //reducing Player Life
  if(player.life>0){
    player.life -=200/3
  } 
  player.update();
  }
}


handleCarCollision(index){
  if(index == 1){
    if(cars[index-1].collide(cars[1])){
      if(this.leftKey){
        player.positionX +=100
      }
      else{
        player.positionX -=100
      }
      //reducing player Life
      if(player.life<=0){
        player.life -=200/3
      }
      player.update()
    }
  }
  if(index == 2){
  if(cars[index-1].collide(cars[0])){
    if(this.leftKey){
      player.positionX +=100
    }
    else{
      player.positionX -=100
    }
    //reducing player Life
    if(player.life<=0){
      player.life -=200/3
    }
    player.update()
    }
  }

}

end(){
  console.log('GAME OVER LOSER');
}


}