class MusclorBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3
  
  awake() {
    this.position = this.actor.getLocalPosition();
    this.actor.setVisible(false);
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() !== "Walk") { return }
    
    this.position.x -= 0.08;
    this.actor.setLocalPosition(this.position);

    if (this.position.x < -4) {
      Game.playerBehavior.canMove = true;
      Game.state.activeQuest = "pickUpOil";
      this.actor.destroy();
    }
  }
      
  appear() {
    this.actor.setVisible(true);
    this.actor.spriteRenderer.setAnimation("Talk");
    
    if (Game.state.activeQuest === "giveFlower") {
      if (Game.inventory["Flower"]) {
        Game.dialogBehavior.show("Musclor", "MusclorFindFlower_1", null, this);
      }
      else {
        Game.dialogBehavior.show("Musclor", "MusclorWaitingForFlower", null, this);
      }
    }
    else {
      Game.dialogBehavior.show("Musclor", "Floor2_MusclorCookies", null, this);
    }
  }
  
  disappear() { this.actor.setVisible(false); }
    
  finishDialog(textId: string, choiceId: string) {
    var dowieAnim = "Idle";
    var musclorAnim = "Idle";
    
    if (textId === "Floor2_MusclorCookies") {
      if (Game.state.activeQuest === "meetMusclor") {
        Game.state.activeQuest = "giveFlower";
        Game.dialogBehavior.show("Dowie", "AskMusclorOnADate", null, this);
        dowieAnim = "Talk";
      }
      else {
        Game.dialogBehavior.show("Dowie", "Floor2_MusclorCookies_NoThanks", null, this);
        dowieAnim = "Talk";
      }
    }
    else if (textId === "AskMusclorOnADate") {
      Game.dialogBehavior.show("Musclor", "AskMusclorOnADate_1", null, this);
      musclorAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_1") {
      Game.dialogBehavior.show("Dowie", "AskMusclorOnADate_2", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_2") {
      Game.dialogBehavior.show("Musclor", "AskMusclorOnADate_3", null, this);
      musclorAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_3") {
      Game.dialogBehavior.show("Dowie", "AskMusclorOnADate_4", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_4") {
      Game.dialogBehavior.show("Musclor", "AskMusclorOnADate_5", null, this);
      musclorAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_5") {
      Game.dialogBehavior.show("Dowie", "AskMusclorOnADate_6", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_6") {
      Game.dialogBehavior.show("Dowie", "AskMusclorOnADate_7", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "MusclorWaitingForFlower") {
      Game.dialogBehavior.show("Dowie", "MusclorWaitingForFlower_1", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "MusclorWaitingForFlower_1") {
      Game.dialogBehavior.show("Musclor", "MusclorWaitingForFlower_2", null, this);
      musclorAnim = "Talk";
    }
    else if (textId === "AskMusclorOnADate_7" || textId === "Floor2_MusclorCookies_NoThanks" || textId === "MusclorWaitingForFlower_2") {
      this.disappear();
      Sup.getActor("Musclor Door").getBehavior(MusclorDoorBehavior).close();
    }
    else if (textId === "MusclorFindFlower_1") {
      Game.dialogBehavior.show("Dowie", "MusclorFindFlower_2", null, this);
      dowieAnim = "Talk";
    }
    else if (textId === "MusclorFindFlower_2") {
      musclorAnim = "Walk";
      Game.playerBehavior.canMove = false;
      Game.useItem("Flower");
      Sup.getActor("Musclor Door").getBehavior(MusclorDoorBehavior).close();
    }

    this.actor.spriteRenderer.setAnimation(musclorAnim);
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim);
  }
}
Sup.registerBehavior(MusclorBehavior);