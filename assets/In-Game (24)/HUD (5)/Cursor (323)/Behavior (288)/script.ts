class CursorBehavior extends Sup.Behavior {
  position = this.actor.getLocalPosition();
  currentSprite = Sup.get("In-Game/HUD/Cursor/Normal");

  normalSprite = Sup.get("In-Game/HUD/Cursor/Normal", Sup.Sprite);
  interactionSprite = Sup.get("In-Game/HUD/Cursor/Interaction", Sup.Sprite);
  bubbleSprite = Sup.get("In-Game/HUD/Cursor/Bubble", Sup.Sprite);
  fastForwardSprite = Sup.get("In-Game/HUD/Cursor/Fast Forward", Sup.Sprite);
  noFastForwardSprite = Sup.get("In-Game/HUD/Cursor/No Fast Forward", Sup.Sprite);
  
  update() {
    var mousePosition = Sup.Input.getMousePosition();
    var screenSize = Sup.Input.getScreenSize();
    mousePosition.x *= 10 / 2 * screenSize.x / screenSize.y;
    mousePosition.y *= 10 / 2;
    
    this.position.x = mousePosition.x;
    this.position.y = mousePosition.y;
    this.actor.setLocalPosition(this.position);
    
    var newSprite = this.normalSprite;
    
    if (Game.dialogBehavior != null) {
      if (this.position.y < -2.5) {
        newSprite = this.interactionSprite;
      } else if (Game.dialogBehavior.isVisible) {
        if (Game.dialogBehavior.choiceIds != null) {
          newSprite = this.noFastForwardSprite;
        } else {
          newSprite = this.fastForwardSprite;
        }
      }

      else if (Game.playerBehavior.hoveredItem != null) {
        if (Game.playerBehavior.hoveredItem.getBehavior(ItemBehavior).type === "bubble") {
          newSprite = this.bubbleSprite;
        } else {
          newSprite = this.interactionSprite;
        }
      }
    } else {
      newSprite = this.interactionSprite;
    }
    
    if (this.currentSprite !== newSprite) {
      this.currentSprite = newSprite;
      this.actor.spriteRenderer.setSprite(newSprite);
      
      if (newSprite === this.bubbleSprite || newSprite === this.normalSprite) {
        this.actor.spriteRenderer.setAnimation("Animation");
      }
    }
  }
}
Sup.registerBehavior(CursorBehavior);