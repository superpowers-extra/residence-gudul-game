class JanitorWireBehavior extends Sup.Behavior {
  electroTimer = 0;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (Game.state.janitorDoorOpen) {
      this.actor.getBehavior(ItemBehavior).hitbox.width = 0;
      this.actor.getBehavior(ItemBehavior).hitbox.height = 0;
    }
  }
    
  activate() {
    if (! Game.state.janitorPortraitOpen || Game.state.janitorDoorOpen) { return }
    
    if (! Game.state.mustRepairJanitorPortrait) {
      Game.dialogBehavior.show("Dowie_Thought", "Floor0_janitorPortraitKnockFirst", null, null);
      return;
    }
    
    let choices = ["Floor0_janitorPortraitConnectLeft", "Floor0_janitorPortraitConnectRight"];
    Game.dialogBehavior.show("Dowie_Thought", "Floor0_janitorPortraitOpen", choices, this);
  }
  
  
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "Floor0_janitorPortraitConnectLeft") {
      Sup.Audio.playSound("SFX/Electrocute");
      Game.playerBehavior.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Hero Electro", Sup.Sprite));
      Game.playerBehavior.actor.spriteRenderer.setAnimation("Animation");
      this.electroTimer = 90;
      Game.playerBehavior.canMove = false;
    }

    else if (choiceId === "Floor0_janitorPortraitConnectRight") {
      Sup.Audio.playSound("SFX/Opening Door");
      Game.state.janitorDoorOpen = true;
      Sup.getActor("Janitor Door").spriteRenderer.setAnimation("Animation", false);
    }
  }
  
  update() {
    if (this.electroTimer > 0) {
      this.electroTimer -= 1;
      
      if (this.electroTimer === 0) {
        Game.playerBehavior.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Sprite", Sup.Sprite));
        Game.playerBehavior.actor.spriteRenderer.setAnimation("Idle");
        Game.playerBehavior.canMove = true;
        
        Game.dialogBehavior.show("Dowie_Thought", "Floor0_janitorElectrocuted", null, null);
      }
    }
  }
}
Sup.registerBehavior(JanitorWireBehavior);