class PlayerHallDoorBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  activate() {
    Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 3/Hall/Prefab", "Player Door");
  }
}
Sup.registerBehavior(PlayerHallDoorBehavior);
