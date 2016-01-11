class FlowerPotBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  start() {
    if (Game.state.flowerPickedUp) { this.actor.destroy(); }
  }
      
  activate() {
    Game.dialogBehavior.show("Dowie", "OldWomanFlower", ["OldWomanFlower_yes", "OldWomanFlower_no"], this);
  }
    
  finishDialog(textId: string, choiceId: string) {
    if (choiceId !== "OldWomanFlower_yes") { return}
    
    Game.state.flowerPickedUp = true;
    Game.getItem("Flower");
    Game.playerBehavior.hoveredItem = null;
    this.actor.destroy();
  }
}
Sup.registerBehavior(FlowerPotBehavior);