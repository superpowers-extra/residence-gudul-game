class OilBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (Game.state.oilPickedUp) {
      this.actor.destroy();
      return;
    }
  }
  
  activate() {
    Game.dialogBehavior.show("Dowie", "Beauty_pickUpOil", ["Beauty_pickUpOil_yes", "Beauty_pickUpOil_no"], this);
  }
    
  finishDialog(textId: string, choiceId: string) {
    if (choiceId !== "Beauty_pickUpOil_yes") return;
    
    Game.state.oilPickedUp = true;
    Game.state.activeQuest = "useOil";
    Game.getItem("Oil");
    Game.playerBehavior.hoveredItem = null;
    this.actor.destroy();
  }
}
Sup.registerBehavior(OilBehavior);
