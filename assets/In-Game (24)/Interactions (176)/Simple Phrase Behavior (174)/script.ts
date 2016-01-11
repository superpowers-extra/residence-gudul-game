class SimplePhraseBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
    
    if (Game.TextData[this.actor.getName()] == null) {
      Sup.log(`WARNING: no text set for - ${this.actor.getName()} - item`);
    }
  }
  
  activate() {
    Game.dialogBehavior.show("Dowie", this.actor.getName(), null);
  }
}
Sup.registerBehavior(SimplePhraseBehavior);
