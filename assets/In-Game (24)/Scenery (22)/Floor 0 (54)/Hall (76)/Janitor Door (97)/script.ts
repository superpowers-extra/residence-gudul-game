class JanitorDoorBehavior extends Sup.Behavior {
  activated = false;
  finishedOpening = false;
  isKnocking = false;
  
  awake() {
    this.actor["actionBehavior"] = this;
    if (Game.state.janitorDoorOpen) {
      this.actor.spriteRenderer.setSprite(Sup.get("In-Game/Scenery/Door Open", Sup.Sprite));
      this.finishedOpening = true;
    }
  }

  update() {
    if (Game.state.janitorDoorOpen && ! this.finishedOpening && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      this.finishedOpening = true;
      this.actor.spriteRenderer.setSprite(Sup.get("In-Game/Scenery/Door Open", Sup.Sprite));
    }
    
    if (this.isKnocking && Game.playerBehavior.actor.spriteRenderer.getAnimation() !== "DingDong") {
      this.isKnocking = false;
      
      if (! Game.state.janitorDoorKnocked) {
        Game.state.janitorDoorKnocked = true;
        // play fight sound
        Sup.Audio.playSound("SFX/Fight");
        Game.dialogBehavior.show("Janitor", "Floor0_janitorFightNoises", null, this);
      }
      else if (! Game.state.janitorCalledForHelp) {
        Game.state.janitorCalledForHelp = true;
        Game.dialogBehavior.show("Janitor", "Floor0_janitorHelp", null, null);
      }
      else {
        Game.dialogBehavior.show("Janitor", "Floor0_janitorNoResponse", null, null);
      }
    }
  }
  // called when click on the door's hitbox
  activate() {
    if (Game.state.janitorDoorOpen) {
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 0/Janitor/Prefab", "Hall Door")
      return
    }
    
    if (! Game.state.janitorDoorKnocked) {
      var choices = [ "Floor0_janitorDoorChoiceToquer", "Floor0_janitorDoorChoiceWalkAway" ];
      Game.dialogBehavior.show("Dowie", "WhatDowieDoNow", choices, this);
    }
    else {
      var choices = [ "Floor0_janitorDoorChoiceOpen", "Floor0_janitorDoorChoiceToquer" ];
      Game.dialogBehavior.show("Dowie", "WhatDowieDoNow", choices, this);
    }
  }
    
  finishDialog(textId: string, choiceId: string) {
    if (textId === "WhatDowieDoNow") {
      if (choiceId === "Floor0_janitorDoorChoiceToquer") {
        Game.playerBehavior.canMove = false;
        Game.playerBehavior.actor.spriteRenderer.setAnimation("DingDong", false)
        Sup.Audio.playSound("SFX/Knock");
        this.isKnocking = true;
      }
       
      else if (choiceId === "Floor0_janitorDoorChoiceOpen") {
        Sup.Audio.playSound("SFX/Locked Door");
        Game.dialogBehavior.show("Dowie", "Floor0_dowieMustRepairJanitorPortrait", null, null);
        Game.state.mustRepairJanitorPortrait = true;
      }
    }
    else if (textId === "Floor0_janitorFightNoises") {
      Game.dialogBehavior.show("Dowie", "Floor0_dowieJanitorMurderComment", null, null);
    }
  }
}
Sup.registerBehavior(JanitorDoorBehavior);