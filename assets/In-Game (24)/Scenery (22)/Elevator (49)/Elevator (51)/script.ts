class ElevatorBehavior extends Sup.Behavior {
  floorOffset = 0;
  nextFloorId = -1;
  shaftAnimSpeed = 4;
  cloudMoveOffset = new Sup.Math.Vector3(-0.005,0,0);

  sound: Sup.Audio.SoundPlayer;

  shaft: Sup.Actor;
  shaftInitialPosition: Sup.Math.Vector3;
  shaftPosition: Sup.Math.Vector3;

  cityf: Sup.Actor;
  cityb: Sup.Actor;
  cloud: Sup.Actor;
    
  awake() {
    this.sound = new Sup.Audio.SoundPlayer("SFX/Elevator");
    
    // Game.state.isInElevator = true;
    
    this.shaft = this.actor.getChild("Shaft");
    this.shaftInitialPosition = this.shaft.getLocalPosition();
    // this.shaft.offsetPerFloor = 8;
    this.shaft["offsetPerFloor"] = 7*2.2;
    // 7 offset betwen 2 floors   2.5 is shaft's scale

    this.cityf = this.actor.getChild("City Foreground");
    this.cityf["initialPosition"] = this.cityf.getLocalPosition();
    this.cityf["offsetPerFloor"] = 1/3;
    
    this.cityb = this.actor.getChild("City Background");
    this.cityb["initialPosition"] = this.cityb.getLocalPosition();
    this.cityb["offsetPerFloor"] = 0.5/3;
    
    // init positions based on current floor
    var relativeOffset = this.shaft["offsetPerFloor"] * -Game.state.currentFloor;
    this.shaft.moveLocal(new Sup.Math.Vector3(0,relativeOffset,0))
    
    var relativeOffset = this.cityf["offsetPerFloor"] * -Game.state.currentFloor;
    this.cityf.moveLocal(new Sup.Math.Vector3(0,relativeOffset,0))
    
    relativeOffset = this.cityb["offsetPerFloor"] * -Game.state.currentFloor;
    this.cityb.moveLocal(new Sup.Math.Vector3(0,relativeOffset,0))
    
    // clouds
    this.cloud = this.actor.getChild("Cloud");
    var position = this.cloud.getLocalPosition();
    // randomly move 8 units left or right
    position.x += Sup.Math.Random.integer(-80, 80) / 10
    this.cloud.setLocalPosition(position)

    if (Sup.Math.Random.integer(1, 2) === 2) {
      var scale = this.cloud.getLocalScale();
      scale.x = -scale.x;
      this.cloud.setLocalScale(scale);
    }
    
    this.init();
  }
  
  update() {
    this.cloud.moveLocal(this.cloudMoveOffset);
  }
    
  init() {
    // build choices list based on current floor
    var destinationChoices = [];
    var floorChoices = [ "rdc", "etage1", "etage2", "etage3" ];
    
    var i = 3;
    for(var i = 3; i >= 0; i--) {
      var floor = floorChoices[i];
      if (i !== Game.state.currentFloor) {
        destinationChoices.push("ascenseur_destination_choix_" + floor);
      }
    }
    
    destinationChoices.push("ascenseur_destination_choix_sortir");
    
    Game.dialogBehavior.show("Dowie", "WhatDowieDoNow", destinationChoices, this);
  }
  
  // called when the player has chosen its destination
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "ascenseur_destination_choix_sortir") {
      Game.state.isInElevator = false;
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor "+Game.state.currentFloor+"/Hall/Prefab", "Elevator");
      return;
    
      
    } else if (choiceId === "ascenseur_destination_choix_rdc") {
      this.nextFloorId = 0;
    } else if (choiceId === "ascenseur_destination_choix_etage1") {
      this.nextFloorId = 1;
    } else if (choiceId === "ascenseur_destination_choix_etage2") {
      this.nextFloorId = 2;
    } else if (choiceId === "ascenseur_destination_choix_etage3") {
      this.nextFloorId = 3;
    } else {
      Sup.log("elevator finish dialog: no choice id - " + textId + " - " + choiceId);
    }
    
    this.floorOffset = this.nextFloorId - Game.state.currentFloor;
    this.animate();
  }
  
  animate() {
    var from = { shaftY: 0, cityfY: 0, citybY: 0}, to = { shaftY: 0, cityfY: 0, citybY: 0};
    
    // shaft
    this.shaftPosition = this.shaft.getLocalPosition();
    from.shaftY = this.shaftPosition.y;
    to.shaftY = this.shaftPosition.y + this.shaft["offsetPerFloor"] * -this.floorOffset;
    
    // city
    this.cityf["currentPosition"] = this.cityf.getLocalPosition();
    from.cityfY = this.cityf["currentPosition"].y;
    to.cityfY = this.cityf["currentPosition"].y + this.cityf["offsetPerFloor"] * -this.floorOffset;
    
    this.cityb["currentPosition"] = this.cityb.getLocalPosition();
    from.citybY = this.cityb["currentPosition"].y;
    to.citybY = this.cityb["currentPosition"].y + this.cityb["offsetPerFloor"] * -this.floorOffset;
     
    new Sup.Tween(this.actor, from)
      .to(to, Math.abs(this.floorOffset) * this.shaftAnimSpeed * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate((object) => {
        this.shaftPosition.y = object.shaftY;
        this.shaft.setLocalPosition(this.shaftPosition);

        this.cityf["currentPosition"].y = object.cityfY;
        this.cityf.setLocalPosition(this.cityf["currentPosition"]);

        this.cityb["currentPosition"].y = object.citybY;
        this.cityb.setLocalPosition(this.cityb["currentPosition"]);
      })
      .onComplete(() => {
        this.sound.play();
        Game.state.currentFloor = this.nextFloorId;
        this.init();
      })
      .start();
  }
}
Sup.registerBehavior(ElevatorBehavior);