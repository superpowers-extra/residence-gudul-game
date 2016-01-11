class SuckerBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  start() {
    if (Game.state.suckerPickedUp) {
      this.actor.destroy();
    }
  }
  
  activate() {
    Game.dialogBehavior.show("Dowie", "sucker_pickup", [ "sucker_pickup_yes", "sucker_pickup_no" ], this);
  }
  
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "sucker_pickup_yes") {
      Game.getItem("Sucker");
      Game.state.suckerPickedUp = true;
      Game.playerBehavior.hoveredItem = null;
      this.actor.destroy();
    }
  }

}
Sup.registerBehavior(SuckerBehavior);