class FatsexHallDoorBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  activate() {
    Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 3/Hall/Prefab", "Beauty Door");
  }
    
}
Sup.registerBehavior(FatsexHallDoorBehavior);
