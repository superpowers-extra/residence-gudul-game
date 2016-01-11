class PlayerDoorBehavior extends Sup.Behavior {
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  update() {
    if (this.actor.spriteRenderer.getAnimation() == "Animation" && ! this.actor.spriteRenderer.isAnimationPlaying()) {
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Floor 3/Dowie/Prefab", "Hall Door");
    }
  }
      
  activate() {
    Game.playerBehavior.canMove = false;
    this.actor.spriteRenderer.setAnimation("Animation", false);
    Sup.Audio.playSound("SFX/Opening Door");
  }
}
Sup.registerBehavior(PlayerDoorBehavior);
