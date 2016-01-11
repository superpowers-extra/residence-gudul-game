class PlayerBehavior extends Sup.Behavior {
  baseSpeed = 0.05;
  footstepsSound = new Sup.Audio.SoundPlayer(Sup.get("In-Game/Player/Footsteps", Sup.Sound));

  position = this.actor.getLocalPosition();
  moveOffset = new Sup.Math.Vector3(0,0,0);
  moveTargetX: number = null;
  scale = this.actor.getLocalScale();
  canMove = false;
  autoPilot = false;
  leftLimit = 0;
  rightLimit = 0;

  mousePosition = new Sup.Math.Vector3(0,0,0);
  hoveredItem: Sup.Actor;
  targetItem: Sup.Actor;
  activateDistance = 1.5;

  awake() {
    Game.playerBehavior = this;
    
    this.footstepsSound.setLoop(true);
  }

  update() {
    let mousePosition = Sup.Input.getMousePosition();
    let screenSize = Sup.Input.getScreenSize();

    mousePosition.x *= 10 / 2 * screenSize.x / screenSize.y;
    mousePosition.x += Game.cameraBehavior.position.x;
    mousePosition.y *= 10 / 2;
    mousePosition.y += Game.cameraBehavior.position.y;

    this.mousePosition.set(mousePosition.x, mousePosition.y, 0);

    if (this.autoPilot) {
      this.move();
      return;
    }

    if (!this.canMove) {
      let animName = this.actor.spriteRenderer.getAnimation();
      if (animName != "Walk") {
        this.footstepsSound.pause();
      }
      
      if (animName === "Walk" || !this.actor.spriteRenderer.isAnimationPlaying()) {
        if (animName === "Sucker Attack") {
          this.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Sprite", Sup.Sprite));
        }
        
        this.actor.spriteRenderer.setAnimation("Idle");
      }
      return;
    }
    
    this.move();
    this.interaction();
  }
  
  move() {
    if (this.moveTargetX != null) {
      if (this.moveTargetX < this.position.x) {
        this.moveOffset.x = -this.baseSpeed;
      } else if (this.moveTargetX > this.position.x) {
        this.moveOffset.x = this.baseSpeed;
      }
    }
    
    if (this.position.x + this.moveOffset.x <= this.leftLimit || this.position.x + this.moveOffset.x >= this.rightLimit) {
      this.clearMovement()
    }
    
    this.position.add(this.moveOffset);
    this.actor.setLocalPosition(this.position);
    
    if (this.moveTargetX != null && Math.abs(this.position.x - this.moveTargetX) < 0.1) {
      this.clearMovement();
    }
    
    if (this.moveOffset.x === 0) {
      let anim = this.actor.spriteRenderer.getAnimation();
      if (anim !== "Walk" || this.actor.spriteRenderer.getAnimationFrameTime() > 2) {
        this.actor.spriteRenderer.setAnimation("Idle");
        this.footstepsSound.pause();
      }

    } else {
      this.actor.spriteRenderer.setAnimation("Walk");
      this.footstepsSound.play();
    }

    if (this.moveOffset.x < 0) {
      this.scale.x = -1;
    } else if (this.moveOffset.x > 0) {
      this.scale.x = 1;
    }

    this.actor.setLocalScale(this.scale);
  }
  
  clearMovement() {
    this.moveTargetX = null;
    this.moveOffset.x = 0;
    this.targetItem = null;
  }
    
  interaction() {
    // Check targetItem
    if (this.targetItem != null && Math.abs(this.position.x - this.targetItem.getBehavior(ItemBehavior).position.x) <= this.activateDistance) {
      this.activateItem(this.targetItem);
      this.clearMovement();
      return;
    }

    // Update interactions
    let closestItem: Sup.Actor = null;
    let minDistance = 1000;
    
    Game.itemBehaviors.forEach((itemBehavior) => {
      let diff = this.mousePosition.clone().subtract(itemBehavior.position);
      diff.x -= itemBehavior.hitbox.offsetX;
      diff.y -= itemBehavior.hitbox.offsetY;
      let distance = diff.length();
      
      if (Math.abs(diff.x) < itemBehavior.hitbox.width && Math.abs(diff.y) < itemBehavior.hitbox.height) {
        minDistance = distance;
        closestItem = itemBehavior.actor;
      }
    });
    
    if (closestItem == null && this.hoveredItem != null) {
      this.hoveredItem.getBehavior(ItemBehavior).hover(false);
      this.hoveredItem = null;
    }
    
    if (closestItem != null && closestItem != this.hoveredItem) {
      if (this.hoveredItem != null) {
        this.hoveredItem.getBehavior(ItemBehavior).hover(false)
      }
        
      this.hoveredItem = closestItem;
      this.hoveredItem.getBehavior(ItemBehavior).hover(true);
      new Sup.Audio.SoundPlayer(Game.hoverSound).play();
    }
    
    if (Game.dialogBehavior.closedTimer > 2) {
      if ((Sup.Input.isMouseButtonDown(0) || Sup.Input.wasMouseButtonJustReleased(0))
          && (this.hoveredItem == null || Math.abs(this.position.x - this.hoveredItem.getBehavior(ItemBehavior).position.x) > this.activateDistance)) {
        if (Math.abs(this.position.x - this.mousePosition.x) >= 0.1) {
          this.moveTargetX = this.mousePosition.x;
          
          if (Sup.Input.wasMouseButtonJustReleased(0)) {
            this.targetItem = this.hoveredItem;
            if (this.targetItem != null) {
              new Sup.Audio.SoundPlayer(Game.selectSound).play();
            }
          }
        }
      }
      
      if (this.hoveredItem != null && Sup.Input.wasMouseButtonJustReleased(0)
          && Math.abs(this.position.x - this.hoveredItem.getBehavior(ItemBehavior).position.x) <= this.activateDistance) {
        this.activateItem(this.hoveredItem);
        new Sup.Audio.SoundPlayer(Game.selectSound).play()
      }
    }
  }
  
  activateItem(item: Sup.Actor) {
    if (item["actionBehavior"] == null) {
      Sup.log("ActionBehavior isn't defined");
    } else {
      if (item.getBehavior(ItemBehavior).position.x > this.position.x) {
        this.scale.x = 1;
      } else {
        this.scale.x = -1;
      }
      this.actor.setLocalScale(this.scale);

      this.clearMovement();
      item["actionBehavior"].activate();
    }
  }

}
Sup.registerBehavior(PlayerBehavior);
