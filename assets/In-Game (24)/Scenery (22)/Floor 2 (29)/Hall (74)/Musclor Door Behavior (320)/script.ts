class MusclorDoorBehavior extends Sup.Behavior {
  activated = false;
  isKnocking = false;

  hitboxWidth: number;
  hitboxHeight: number;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    this.hitboxWidth = this.actor.getBehavior(ItemBehavior).hitbox.width;
    this.hitboxHeight = this.actor.getBehavior(ItemBehavior).hitbox.height;
  }
  
  update() {
    if (this.isKnocking && Game.playerBehavior.actor.spriteRenderer.getAnimation() !== "DingDong") {
      this.isKnocking = false;
      this.activated = true;
      this.actor.spriteRenderer.setAnimation("Animation", false);
      Sup.Audio.playSound("SFX/Opening Door");
    }
    
    if (this.activated && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      this.activated = false;
      this.actor.getBehavior(ItemBehavior).hitbox.width = 0;
      this.actor.getBehavior(ItemBehavior).hitbox.height = 0;
      Sup.getActor("Musclor").getBehavior(MusclorBehavior).appear();
    }
  }

  activate() {
    if (Game.state.flowerPickedUp && ! Game.inventory["Flower"]) {
      Game.dialogBehavior.show("Dowie", "MusclorLeft", null, null);
    }
    else {
      Game.dialogBehavior.show("Dowie", "MusclorKnock", ["MusclorKnock_yes", "MusclorKnock_no"], this);
    }
  }
      
  finishDialog(textId: string, choiceId: string) {
    if (choiceId !== "MusclorKnock_yes") { return }

    Game.playerBehavior.canMove = false;
    this.isKnocking = true;
    Game.playerBehavior.actor.spriteRenderer.setAnimation("DingDong", false);
    Sup.Audio.playSound("SFX/Knock");
  }
  
  close() {
    this.actor.spriteRenderer.setAnimation(null);
    this.actor.getBehavior(ItemBehavior).hitbox.width = this.hitboxWidth;
    this.actor.getBehavior(ItemBehavior).hitbox.height = this.hitboxHeight;
  }

}
Sup.registerBehavior(MusclorDoorBehavior);