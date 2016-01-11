class BeautyDoorBehavior extends Sup.Behavior {
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  update() {
    if (this.actor.spriteRenderer.getAnimation() === "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 3/Beauty/Prefab", "Hall Door");
    }
  }

  activate() {
    if (Game.state.activeQuest === "askBeautyOil" || Game.state.activeQuest === "meetMusclor") {
      Game.dialogBehavior.show("Beauty", "Beauty_Cry", null, this);
    
    } else if (Game.state.activeQuest === "pickUpOil" || Game.state.activeQuest === "useOil" || Game.state.activeQuest === "finish") {
      Game.dialogBehavior.show("Dowie", "Beauty_Busy", null, this);
    
    } else {
      Game.dialogBehavior.show("Dowie", "PorteFermeeGenerique", null, null);
    }
  }

  finishDialog(textId: string, choiceId: string) {
  
    if (textId === "Beauty_Cry") {
      Game.dialogBehavior.show("Dowie", "Dowie_Beauty_Sad", null, this);
    } else if (textId === "Dowie_Beauty_Sad") {
      Game.state.activeQuest = "meetMusclor";
      Game.dialogBehavior.show("Dowie", "Dowie_Beauty_Comfort", null, this);
    
    } else if (textId === "Beauty_Busy") {
      Game.playerBehavior.canMove = false;
      this.actor.spriteRenderer.setAnimation("Animation", false);
      Sup.Audio.playSound("SFX/Opening Door");
    }
  }
}
Sup.registerBehavior(BeautyDoorBehavior);
