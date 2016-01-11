class MammothBehavior extends Sup.Behavior {
  escaping = false;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (! Game.state.mammouthSeen) {
      Game.state.mammouthSeen = true;
      Game.playerBehavior.actor.spriteRenderer.setAnimation("Shoked", false);
      Game.dialogBehavior.show("Dowie", "TuyauBouche_SeeMammouth", null, this);
    }
    
    if (Game.state.activeQuest === "finish") {
      this.actor.spriteRenderer.setAnimation("Escape");
      this.actor.spriteRenderer.stopAnimation();
      this.actor.spriteRenderer.setAnimationFrameTime(this.actor.spriteRenderer.getAnimationFrameCount() - 1);
    }
  }
  
  update() {
    if (this.escaping && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      this.escaping = false;;
      Game.dialogBehavior.show("Dowie", "UseOil_4", null, null);
      Game.state.activeQuest = "finish";
      Game.TextData.Distritout = Game.TextData.DistritoutRepare;
    }
  }
  
  activate() {
    if (Game.state.activeQuest === "finish") {
      Game.dialogBehavior.show("Dowie", "TuyauFait", null, null);
    }
      
    else if (Game.inventory.Oil) {
      Game.dialogBehavior.show("Dowie", "UseOil_1", [ "UseOil_1_yes", "UseOil_1_no" ], this);
    }
    
    else if (! Game.inventory.Sucker) {
      if (Game.state.activeQuest === "goToBasement") {
        Game.dialogBehavior.show("Dowie", "TuyauBouche_NeedSucker", null, null);
      }
      else {
        Game.dialogBehavior.show("Dowie", "TuyauBouche_NeedOil", null, null);
      }
    }
    else {
      Game.dialogBehavior.show("Dowie", "TuyauBouche", [ "TuyauBouche_UtiliserVentouse", "TuyauBouche_LesDoigts", "TuyauBouche_NeRienFaire" ], this);
    }
  }

  finishDialog(textId: string, choiceId: string) {
    if (textId === "TuyauBouche_SeeMammouth") {
      Game.dialogBehavior.show("Dowie", "TuyauBouche_SeeMammouth_1", null, null);
      return
    }
  
    if (choiceId === "TuyauBouche_UtiliserVentouse") {
      Game.dialogBehavior.show("Dowie", "TuyauBouche_Bloque", null, this);
    }
      
    else if (choiceId === "TuyauBouche_LesDoigts") {
      Game.dialogBehavior.show("Dowie", "TuyauBouche_LesDoigts_MauvaiseIdee", null, this);
    }
      
    else if (textId === "TuyauBouche_Bloque") {
      Game.dialogBehavior.show("Dowie", "TuyauBouche_Bloque1", null, this);
    }
    else if (textId === "TuyauBouche_Bloque1") {
      Game.dialogBehavior.show("Dowie", "TuyauBouche_Bloque2", null, this);
      Game.state.activeQuest = "plantTheCop";
    }
      
    else if (choiceId === "UseOil_1_yes") {
      Game.useItem("Oil");
      Game.dialogBehavior.show("Dowie", "UseOil_2", null, this);
    }
    else if (textId === "UseOil_2") {
      Game.dialogBehavior.show("Dowie", "UseOil_3", null, this);
    }
    
    else if (textId === "UseOil_3") {
      Sup.Audio.playSound("SFX/Mammouth");
      this.actor.spriteRenderer.setAnimation("Escape", false);
      this.escaping = true;
      Game.playerBehavior.canMove = false;
    }
  }
}
Sup.registerBehavior(MammothBehavior);