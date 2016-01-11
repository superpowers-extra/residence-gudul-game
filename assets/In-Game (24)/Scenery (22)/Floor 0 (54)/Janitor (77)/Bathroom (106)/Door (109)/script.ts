class BathroomExitDoorBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  activate() {
    Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 0/Janitor/Prefab", "Bathroom Door");
  }
    
}
Sup.registerBehavior(BathroomExitDoorBehavior);