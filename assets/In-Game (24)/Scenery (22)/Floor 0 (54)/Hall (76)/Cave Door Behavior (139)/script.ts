class CaveDoorBehavior extends Sup.Behavior {
  
  awake() {
    this.actor["actionBehavior"] = this;

  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() === "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 0/Cave/Prefab", "Door");
    }
  }
  
  activate() {
    if (! Game.inventory.Card) {
      Game.dialogBehavior.show("Dowie", "Basement_pass", null, null);
      Sup.Audio.playSound("SFX/Locked Door");
    
    } else {
      Game.dialogBehavior.show("Dowie", "Basement_pass", ["Basement_pass_yes", "Basement_pass_no"], this);
    }
  }
  
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "Basement_pass_yes") {
      Game.playerBehavior.canMove = false;
      this.actor.spriteRenderer.setAnimation("Animation", false);
      Sup.getActor("Cave Switch").spriteRenderer.setSprite(Sup.get("In-Game/Scenery/Floor 0/Hall/Pass On", Sup.Sprite));
      Sup.Audio.playSound("SFX/Door Pass");
    }
  }
}
Sup.registerBehavior(CaveDoorBehavior);
