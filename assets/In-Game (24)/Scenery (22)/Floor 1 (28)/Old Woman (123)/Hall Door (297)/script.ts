class OldWomanDoorBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  activate() {
    Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 1/Hall/Prefab", "Old Woman Door");
  } 
}
Sup.registerBehavior(OldWomanDoorBehavior);