class CaveHallDoorBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  activate() {
    Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 0/Hall/Prefab", "Cave Exit");
  }
    
}
Sup.registerBehavior(CaveHallDoorBehavior);