class JanitorFakeBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (Game.state.skinPickedUp) {
      this.actor.destroy()
      return
    }
  }

  activate() {
    var textId ="";
    var choiceIds = null;
  
    if (Game.state.activeQuest === "goToJanitor") {
      textId ="Janitor_fake";
    }
    else {
      textId = "Janitor_pickup";
      choiceIds = [ "Janitor_pickup_yes", "Janitor_pickup_no" ];
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Dowie", textId, choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var dowieAnim ="Idle";
    
    if (textId === "Janitor_fake") {
      dowieAnim ="Talk";
      Game.dialogBehavior.show("Dowie", "Janitor_fake_1", [ "Janitor_pickup_yes", "Janitor_pickup_no" ], this)
    }
    else if (textId === "Janitor_fake_1" || textId === "Janitor_pickup") {
      if (choiceId === "Janitor_pickup_yes") {
        Game.getItem("Skin");
        Game.state.skinPickedUp =true;
        this.actor.destroy();
      }
    }
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim)
  }
}
Sup.registerBehavior(JanitorFakeBehavior);