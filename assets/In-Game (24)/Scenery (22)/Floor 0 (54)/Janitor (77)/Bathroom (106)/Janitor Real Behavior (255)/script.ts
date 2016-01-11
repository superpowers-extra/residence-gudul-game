class JanitorRealBehavior extends Sup.Behavior {
  blood1: Sup.Actor;
  blood2: Sup.Actor;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    this.blood1 = Sup.getActor("Blood 1");
    this.blood1.setVisible(false);
    this.blood2 = Sup.getActor("Blood 2");
    this.blood2.setVisible(false);
  }
  
  update() {
    if (this.blood1.spriteRenderer.getAnimation() === "Animation" && ! this.blood1.spriteRenderer.isAnimationPlaying()) {
      this.blood1.spriteRenderer.setAnimation(null);
      this.blood1.setVisible(false);
      
      this.blood2.spriteRenderer.setAnimation("Animation", false);
      this.blood2.setVisible(true);
    }
      
    if (this.blood2.spriteRenderer.getAnimation() === "Animation" && ! this.blood2.spriteRenderer.isAnimationPlaying()) {
      this.blood2.spriteRenderer.setAnimation(null);
      this.blood2.setVisible(false);
      
      Game.state.activeQuest = "goToBasement";
      Game.getItem("Card");
      Game.dialogBehavior.show("Dowie", "Janitor_pass_info", null, this);
    }
  }

  activate() {
    var textId = "";
    var choiceIds = null;
    
    if (Game.state.activeQuest === "goToJanitor") {
      Game.state.activeQuest = "pickUpPass";
      textId = "Janitor_real";
    }
    else if (! Game.inventory.Card) {
      textId = "Janitor_pickup_pass";
      choiceIds = [ "Janitor_pickup_pass_yes", "Janitor_pickup_pass_no" ];
    }
    else {
      textId = "Janitor_real_end";
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Dowie", textId, choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var dowieAnim = "Idle";
    var dowieAnimLoop = true;
    
    if (textId === "Janitor_real") {
      dowieAnim = "Talk";
      Game.dialogBehavior.show("Dowie", "Janitor_pickup_pass", [ "Janitor_pickup_pass_yes", "Janitor_pickup_pass_no" ], this)
    }
    
    else if (textId === "Janitor_pickup_pass") {
      if (choiceId === "Janitor_pickup_pass_yes") {
        this.blood1.spriteRenderer.setAnimation("Animation", false)
        this.blood1.setVisible(true)
        
        dowieAnim = "DingDong";
        dowieAnimLoop = false;
        Game.playerBehavior.canMove = false;
      }
    }
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim, dowieAnimLoop)
  }
}
Sup.registerBehavior(JanitorRealBehavior);