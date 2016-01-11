class ItemBehavior extends Sup.Behavior {
  isHovered = true;

  position = this.actor.getPosition();
  hitbox = { offsetX: 0, offsetY: 0, width: 1, height: 1 };

  type: string; // "bubble", ... ?
  
  awake() {
    Game.itemBehaviors.push(this);
    this.hover(false);
    this.position.z = 0;
  }
  onDestroy() {
    let index = Game.itemBehaviors.indexOf(this);
    if (index !== -1) Game.itemBehaviors.splice(index, 1);
  }
  
  start() {
    let rectangleHitbox = this.actor.getChild("Rectangle");
    
    if (rectangleHitbox != null) {
      let scale = rectangleHitbox.getLocalScale();
      this.hitbox.width = scale.x / 2;
      this.hitbox.height = scale.y / 2;
      this.hitbox.offsetX = rectangleHitbox.getLocalPosition().x;
      this.hitbox.offsetY = rectangleHitbox.getLocalPosition().y;
      rectangleHitbox.spriteRenderer.setOpacity(0);
    }
    
    if (this.actor["actionBehavior"] == null) {
      Sup.log(`WARNING: missing actionBehavior on ${this.actor.getName()}`);
    }
  }
  
  hover(hovered: boolean) {
    this.isHovered = hovered;
    
    if (this.actor.spriteRenderer != null) {
      if (this.isHovered) {
        this.actor.spriteRenderer.setColor(1.5, 1.5, 1.5);
      } else {
        this.actor.spriteRenderer.setColor(1, 1, 1);
      }
    }
  }
}
Sup.registerBehavior(ItemBehavior);
