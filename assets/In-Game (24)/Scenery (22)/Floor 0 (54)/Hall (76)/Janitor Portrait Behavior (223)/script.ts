class JanitorPortraitBehavior extends Sup.Behavior {

  startPosition: Sup.Math.Vector3;
  
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  start() {
    if (Game.state.janitorPortraitOpen) {
      this.actor.getBehavior(ItemBehavior).hitbox.width = 0;
      this.actor.getBehavior(ItemBehavior).hitbox.height = 0;
      
      var pos = this.actor.getLocalPosition();
      pos.y = -1.5;
      this.actor.setLocalPosition(pos);
      
      var angles = this.actor.getLocalEulerAngles();
      angles.z = 0;
      this.actor.setLocalEulerAngles(angles);
    }
  }
  
  activate() {
    if (Game.state.janitorPortraitOpen === false) {
      Game.dialogBehavior.show("Dowie", "Floor0_janitorPortrait", null, this);
    } else {
      Game.dialogBehavior.show("Dowie", "Floor0_janitorPortraitBroken", null, this);
    }
  }
  
  finishDialog(textId: string) {
    if (textId === "Floor0_janitorPortrait") {
      Game.dialogBehavior.show("Dowie", "Floor0_janitorPortraitFalling", null, this);
    
    } else if (textId === "Floor0_janitorPortraitFalling") {
      Game.state.janitorPortraitOpen = true;
      this.openPanel();
      Game.dialogBehavior.show("Dowie", "Floor0_janitorPortraitBroken", null, this);
    }
  }
    
  openPanel() {
    Sup.Audio.playSound("SFX/Clang");
  
    this.startPosition = this.actor.getLocalPosition();
    new Sup.Tween(this.actor, {posY: this.startPosition.y, eulerZ: -25})
      .to({posY: -1.5, eulerZ: 0}, 500)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate((state) => {
        this.startPosition.y = state.posY;
        this.actor.setLocalPosition(this.startPosition);
        this.actor.setLocalEulerAngles(new Sup.Math.Vector3(0, 0, Sup.Math.toRadians(state.eulerZ)));
      })
      .start();
    
    this.actor.getBehavior(ItemBehavior).hitbox.width = 0;
    this.actor.getBehavior(ItemBehavior).hitbox.height = 0;
  }
}
Sup.registerBehavior(JanitorPortraitBehavior);
