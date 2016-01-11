class CopBehavior extends Sup.Behavior {
  triggered = false;
  playerAttacking = false;

  runLeft = false;
  runRight = false;
  
  start() {
    if (Game.state.activeQuest !== "plantTheCop") {
      this.actor.destroy();
      return;
    }
  }
      
  update() {
    if (Game.playerBehavior.position.x < -1 && ! this.triggered) {
      this.triggered = true;
      Game.playerBehavior.clearMovement();
      
      Game.dialogBehavior.show("Maid", "maid_accuse", null, this);
      Sup.getActor("Maid").spriteRenderer.setAnimation("Talk");
      return;
    }
    
    if (Game.playerBehavior.autoPilot && Game.playerBehavior.moveTargetX == null) {
      Game.playerBehavior.autoPilot = false;
      Game.dialogBehavior.show("Dowie", "dowie_deaf", [ "dowie_plant_cop", "dowie_plant_cop" ], this);
      Game.playerBehavior.actor.spriteRenderer.setAnimation("Talk");
    }
    
    if (this.playerAttacking) {
      if (Game.playerBehavior.actor.spriteRenderer.getAnimation() !== "Sucker Attack") {
        this.playerAttacking = false;
        Game.state.activeQuest = "askBeautyOil";
      }
        
      if (Game.playerBehavior.actor.spriteRenderer.getAnimationFrameIndex() > 13 && this.actor.spriteRenderer.getAnimation() !== "Hit") {
        Game.useItem("Sucker");
        Sup.Audio.playSound("SFX/Plunger");
        this.actor.spriteRenderer.setSprite(Sup.get("In-Game/Pnj/Cop Hit", Sup.Sprite));
        this.actor.spriteRenderer.setAnimation("Hit", false);
      }
    }
    
    if (this.actor.spriteRenderer.getAnimation() === "Hit" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      this.actor.spriteRenderer.setSprite(Sup.get("In-Game/Pnj/Cop", Sup.Sprite));
      this.actor.spriteRenderer.setAnimation("Run");
      Sup.Audio.playSound("SFX/Voices/Cop run");
      this.runRight = true;
    }
    
    if (this.runRight) {
      this.actor.setLocalScale(new Sup.Math.Vector3(1, 1, 1))
      this.actor.move(new Sup.Math.Vector3(0.2, 0, 0))
      if (this.actor.getPosition().x > 8) {
        this.runRight = false;
        this.runLeft = true;
      }
    }
    
    if (this.runLeft) {
      this.actor.setLocalScale(new Sup.Math.Vector3(-1, 1, 1));
      this.actor.move(new Sup.Math.Vector3(-0.2, 0, 0));
      if (this.actor.getPosition().x < -13) {
        Game.playerBehavior.canMove = true;
        this.actor.destroy();
      }
    }
  }

  finishDialog(textId: string, choiceId: string) {
    var copAnim = "Idle";
    var maidAnim = "Idle";
    var dowieAnim = "Idle";
    var dowieAnimLoop = true;
    
    if (textId === "maid_accuse") {
      Game.dialogBehavior.show("Dowie", "dowie_innocent", null, this);
      dowieAnim = "Talk";
    } else if (textId === "dowie_innocent") {
      Game.dialogBehavior.show("Cop", "cop_arrest", null, this);
      copAnim = "Talk";
    } else if (textId === "cop_arrest") {
      Game.playerBehavior.autoPilot = true;
      Game.playerBehavior.moveTargetX = -5;
    } else if (textId === "dowie_deaf") {
      Game.playerBehavior.actor.spriteRenderer.setSprite("In-Game/Player/Sucker Attack");
      this.playerAttacking = true;
      dowieAnim = "Sucker Attack";
      dowieAnimLoop = false;
      Game.playerBehavior.canMove = false;
    }
    
    this.actor.spriteRenderer.setAnimation(copAnim);
    Sup.getActor("Maid").spriteRenderer.setAnimation(maidAnim);
    Game.playerBehavior.actor.spriteRenderer.setAnimation(dowieAnim, dowieAnimLoop);
  }
}
Sup.registerBehavior(CopBehavior);