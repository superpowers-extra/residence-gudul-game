class MaidBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  
    // Maid should only appear at the beginning of the game
    // and when the cop is here
    if (Game.state.activeQuest !== "goToJanitor" && Game.state.activeQuest !== "plantTheCop") {
      this.actor.destroy();
      return
    }
  }
      
  activate() {
    Game.dialogBehavior.show("Maid", "Floor0_maidGrumble", null, this);
  }

  finishDialog(textId: string, choiceId: string) {
    if (textId === "Floor0_maidGrumble") {
      Game.dialogBehavior.show("Dowie", "Floor0_maidGrumble_1", null, this);
    }
  }

}
Sup.registerBehavior(MaidBehavior);
