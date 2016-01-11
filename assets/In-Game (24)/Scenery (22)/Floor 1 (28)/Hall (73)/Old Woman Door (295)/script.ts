class OldWomanDoorInBehavior extends Sup.Behavior {
  isKnocking = false;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() === "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 1/Old Woman/Prefab", "Door");
    }
    
    if (this.isKnocking && Game.playerBehavior.actor.spriteRenderer.getAnimation() != "DingDong") {
      this.isKnocking = false;
      
      Game.dialogBehavior.show("Old Woman", "OldWomanFlowerKnock_1", null, this);
    }
  }
      
  activate() {
    if (Game.state.flowerPickedUp) {
      Game.dialogBehavior.show("Dowie", "OldWomanFlowerEnd", null, null);
    } else {
      Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock", ["OldWomanFlowerKnock_yes", "OldWomanFlowerKnock_no"], this);
    }
  }
  
  finishDialog(textId: string, choiceId: string) {
    var dowieAnim = "Idle";
    var dowieAnimLoop = true;
    
    if (choiceId === "OldWomanFlowerKnock_yes") {
      Game.playerBehavior.canMove = false;
      dowieAnim = "DingDong";
      dowieAnimLoop = false;
      this.isKnocking = true;
      Sup.Audio.playSound("SFX/Knock");
      
    } else if (textId === "OldWomanFlowerKnock_1") {
      if (Game.state.wearingSkin) {
        Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock_6", null, this);
      } else {
        Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock_2", null, this);
      }
      
    } else if (textId === "OldWomanFlowerKnock_2") {
      Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock_3", null, this);
      dowieAnim = "Talk";
      
    } else if (textId === "OldWomanFlowerKnock_3") {
      if (Game.state.wearingSkin) {
        Game.dialogBehavior.show("Old Woman", "OldWomanFlowerKnock_7", null, this);
      } else if (Game.inventory["Skin"]) {
        Game.dialogBehavior.show("Old Woman", "OldWomanFlowerKnock_4", ["OldWomanFlowerKnock_4_yes", "OldWomanFlowerKnock_4_no"], this);
      } else {
        Game.dialogBehavior.show("Old Woman", "OldWomanFlowerKnock_4", null, this);
      }

    } else if (textId === "OldWomanFlowerKnock_4") {
      if (! Game.inventory["Skin"]) {
        Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock_5", null, null);
      } else if (choiceId === "OldWomanFlowerKnock_4_yes") {
        Game.useItem("Skin");
        Game.state.wearingSkin = true;
        
        Game.playerBehavior.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Janitor Skin", Sup.Sprite))
      }
    
    } else if (textId === "OldWomanFlowerKnock_6") {
      Game.dialogBehavior.show("Dowie", "OldWomanFlowerKnock_3", null, this);
      
    } else if (textId === "OldWomanFlowerKnock_7") {
      Game.playerBehavior.canMove = false;
      this.actor.spriteRenderer.setAnimation("Animation", false);
      Sup.Audio.playSound("SFX/Opening Door");
    }
    
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim, dowieAnimLoop);
  }
}
Sup.registerBehavior(OldWomanDoorInBehavior);
