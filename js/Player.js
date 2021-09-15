class Player {
  constructor() {
    //storing the names of the players
    // index number of the player..
    //need to make player's cars.
    //updating positions of the car in the database
    //need to create a player field too..
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 200;
    this.life = 200
  

  }
  addPlayer(){
    var playerIndex = 'players/player' + this.index;
    if(this.index ==1){
      this.positionX = width/2-150;
    }
    else{
      this.positionX = width/2 +150;
    }
    database.ref(playerIndex).set({
      'name':this.name,
      'positionX':this.positionX,
      'positionY': this.positionY,
      'rank': this.rank,
      'score': this.score
    })
  }

  static getPlayerInfo(){
    var reference = database.ref('players');
    reference.on('value', data =>{
      allPlayers = data.val();
    })
  }
  getCount(){
    var pLocation = database.ref('playerCount');
    pLocation.on('value', //making a function 
    data=>{
      playerCount = data.val();
    })
  }

  updateCount(count){
    database.ref('/').update({
    'playerCount': count

    }
    )
  }

  update(){
    var newLocation = 'players/player' + this.index;
    database.ref(newLocation).update({
      'positionX': this.positionX,
      'positionY': this.positionY,
      'rank': this.rank,
      'score': this.score,
      'life': this.life

    })
  }
  getDistance(){
    var distance = database.ref('players/player'+this.index);
    distance.on('value', data=>{
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;

    })
  }

  getCarsAtEnd(){
    var carsAtEnd = database.ref('CarsAtEnd');
    carsAtEnd.on('value', data=>{
      this.rank = data.val();
    })
  }
  
  static updateCarsAtEnd(rank){
    database.ref('/').update({
      'CarsAtEnd':rank
    })
    
  }
}
