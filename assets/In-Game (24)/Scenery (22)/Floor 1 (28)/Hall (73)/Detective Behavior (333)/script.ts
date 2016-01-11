class DetectiveBehavior extends Sup.Behavior {
  move = false;
  position = this.actor.getLocalPosition();
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (Game.state.flowerPickedUp && ! Game.state.detectiveMet) {
      Game.playerBehavior.scale.x = -1;
      Game.playerBehavior.actor.setLocalScale(Game.playerBehavior.scale);
      Game.dialogBehavior.show("Detective", "DetectiveTalk", ["DetectiveTalk_1", "DetectiveTalk_2"], this);
      this.actor.spriteRenderer.setAnimation("Talk");
    } else {
      this.actor.destroy();
    }
  }
  
  update() {
    if (this.move) {
      this.position.x -= 0.08;
      this.actor.setLocalPosition(this.position);
      
      if (this.position.x < -2) {
        this.move = false;
        Game.dialogBehavior.show("Dowie", "DetectiveTalkEnd", null, this);
      }
    }
  }
        
  
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "DetectiveTalk_1") {
      Game.dialogBehavior.show("Detective", "DetectiveTalk_1_bis", null, this);
      
    } else if (choiceId === "DetectiveTalk_2") {
      Game.dialogBehavior.show("Detective", "DetectiveTalk_2_bis", null, this);
    
    
    } else if (textId === "DetectiveTalk_1_bis" || textId === "DetectiveTalk_2_bis") {
      this.move = true;
      this.actor.spriteRenderer.setAnimation("Walk");
      this.actor.setLocalScale(new Sup.Math.Vector3(-1, 1, 1));
      Game.playerBehavior.canMove = false;
    
    } else if (textId === "DetectiveTalkEnd") {
      Game.state.wearingSkin = false;
      Game.state.detectiveMet = true;
      Game.playerBehavior.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Sprite", Sup.Sprite));
      this.actor.destroy();
    }
  }
}
Sup.registerBehavior(DetectiveBehavior);
