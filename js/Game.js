class Game {
  constructor() {

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.moving = false
    this.left = false
    this.blast = false 
  }

  getState() {
    database.ref("gameState").on("value", function(data) {
      gameState = data.val();
    });
  }
  updateState(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1",car1Img);
    car1.addImage("blast",blast)
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2",car2Img);
    car2.addImage("blast",blast)
    car2.scale = 0.07;

    cars = [car1, car2];
    fuelG = new Group()
    coinG = new Group()
    obG = new Group()
    this.addSprites(fuelG,4,fuelImg,0.02)
    this.addSprites(coinG,18,coinImg,0.09)
    this.addSprites(obG,10,obImg,0.04)
  }
  addSprites(group,num,img,scale){
    for (var i = 0;i<num;i++){
      var sprite=createSprite(random(width/2-150,width/2+150),random(-height*4.5,height-400))
      sprite.addImage(img)
      sprite.scale = scale
      group.add(sprite)
    }
  }
  
  play() {
    form.remove();
    Player.getPlayersInfo();
    player.getCarsAtEnd()
    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.position(width / 3 - 50, 80);

    this.leader2.position(width / 3 - 50, 130);

    if (players !== undefined) {
      background("lightblue")
      image(trackImg, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      this.showLife()
      this.showFuelBar()
      var index = 0;
      for (var i in players) {
        index = index + 1;
        var x = players[i].positionX;
        var y = height - players[i].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(players[i].life<=0){
          this.blast = true
          cars[index-1].changeImage("blast")
          cars[index-1].scale = 0.3
        }

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          camera.position.y = cars[index - 1].position.y;
          cars[index-1].overlap(fuelG,function(a,b){
            player.fuel = 100
            b.remove()
          })
          cars[index-1].overlap(coinG,function(a,b){
            player.score += 10
            player.updateDistance()
            b.remove()
          })
          if(player.fuel>0 && this.moving){
            player.fuel = player.fuel-0.1
          }
          if(player.fuel<=0){
            gameState = 2
            swal({
              title:"Game Over"
            })
          }
          if(player.life<=0){
            this.moving = false
          }
          if(cars[index-1].collide(obG)){
            if(this.left){
              player.positionX = player.positionX + 50
            } else{
              player.positionX = player.positionX - 50
            }
            if(player.life>0){
              player.life = player.life - 25
            }
            player.updateDistance()
          }
          if(index === 1){
          if(cars[index-1].collide(cars[1])){
            if(this.left){
              player.positionX = player.positionX + 50
            } else{
              player.positionX = player.positionX - 50
            }
            if(player.life>0){
              player.life = player.life - 25
            }
            player.updateDistance()
          }
        }

        if(index === 2){
          if(cars[index-1].collide(cars[0])){
            if(this.left){
              player.positionX = player.positionX + 50
            } else{
              player.positionX = player.positionX - 50
            }
            if(player.life>0){
              player.life = player.life - 25
            }
            player.updateDistance()
          }
        }

        }
      }
      if(this.blast=== false){

      
      if (keyIsDown(UP_ARROW)) {
        this.moving = true
        player.positionY += 10;
        player.updateDistance();
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.left = true
        player.positionX -= 5;
        player.updateDistance();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.left = false 
        player.positionX += 5;
        player.updateDistance();
      }
    }
      if(player.positionY>height * 6 - 100){
        gameState=2
        player.rank+=1
        Player.updateCarsAtEnd(player.rank)
        player.updateDistance();
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
          text: "You reached the finish line successfully",
        })
      }

      drawSprites();
    }
  }

  showLife() {
    fill("white");
    rect(width / 2 - 100, height - player.positionY-200, 100, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY-200, player.life, 20);
  }

  showFuelBar() {
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 150, 100, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 150, player.fuel, 20);
  }


  showLeaderboard() {
    var leader1, leader2;
    var player = Object.values(players);
      leader1 =
        player[0].rank +
        "     " +
        player[0].name +
        "     " +
        player[0].score;

      leader2 =
        player[1].rank +
        "     " +
        player[1].name +
        "     " +
        player[1].score;

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
}