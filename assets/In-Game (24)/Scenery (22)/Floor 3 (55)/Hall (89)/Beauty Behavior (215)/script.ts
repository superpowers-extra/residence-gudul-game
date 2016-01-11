class BeautyBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
    
  start() {
    this.actor.getBehavior(ItemBehavior).type = "bubble";
  
    // Beauty should only appear at the beginning of the game
    if (Game.state.activeQuest !== "goToJanitor") {
      this.actor.destroy();
      return;
    }
  }
      
  activate() {
    var choiceIds = [ "Floor3_beautyA1", "Floor3_beautyA2" ];
    
    this.actor.spriteRenderer.setAnimation("Talk");
    Game.dialogBehavior.show("Beauty", "Floor3_beautyPanne", choiceIds, this);
  }

  finishDialog(textId: string, choiceId: string) {
    var beautyAnim = "Idle";
    var dowieAnim = "Idle";
  
    if (textId === "Floor3_beautyPanne") {
      
      if (choiceId === "Floor3_beautyA1") {
        Game.dialogBehavior.show("Beauty", "Floor3_beautyA1_1", null, this);
        beautyAnim = "Talk";
      } else if (choiceId === "Floor3_beautyA2") {
        Game.dialogBehavior.show("Beauty", "Floor3_beautyA2_1", null, this);
        beautyAnim = "Talk";
      }
    
    } else if (textId === "Floor3_beautyA1_1") {
      Game.dialogBehavior.show("Dowie", "Floor3_beautyA1_2", null, this);
      dowieAnim = "Talk";
    
    } else if (textId === "Floor3_beautyA2_1") {
      Game.dialogBehavior.show("Dowie", "Floor3_beautyA2_2", null, this);
    }
    
    this.actor.spriteRenderer.setAnimation(beautyAnim);
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim);
  }
}
Sup.registerBehavior(BeautyBehavior);
