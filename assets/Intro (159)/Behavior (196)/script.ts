class IntroCameraBehavior extends Sup.Behavior {
  properties
    exitIntro = false;
    
    outroTimer = 0;
    outroDelay = 600;
    exitOutro = false;
    
    isBroken = false;
    canBuy = false;
    canClick = false;
    isClicking = false;
    clickTimer = 0;
    clickDelay = 90;
    
    textBehavior: TextBehavior;
    
    buttonHandActor: Sup.Actor;
    
    pushHandActor: Sup.Actor;
    pushHandPosition: Sup.Math.Vector3;
    pushHandAngle: number;
    
    objectActor: Sup.Actor;
    objectPosition: Sup.Math.Vector3;
    objectScale = new Sup.Math.Vector3();
    
    boughtObjectActor: Sup.Actor;
    boughtObjectPosition: Sup.Math.Vector3;
    boughtObjectScale: Sup.Math.Vector3;
    boughtObjectAngles: Sup.Math.Vector3;
    buyNowActor: Sup.Actor;
    
    errorActor: Sup.Actor;
    
    objects = ["Crisps", "Chicken", "Chiome", "Apple", "Swing", "Axe"];
    currentItem: number = -1;
  
  awake() {
    this.buttonHandActor = Sup.getActor("Button Hand");
    
    this.pushHandActor = Sup.getActor("Push Hand");
    this.pushHandPosition = this.pushHandActor.getLocalPosition();
    this.pushHandAngle = this.pushHandActor.getLocalEulerZ();
    
    this.objectActor = Sup.getActor("Object");
    this.objectPosition = this.objectActor.getLocalPosition();
    this.objectActor.setLocalScale(this.objectScale)
    
    this.boughtObjectActor = Sup.getActor("Buyed Object");
    this.boughtObjectPosition = this.boughtObjectActor.getLocalPosition();
    this.boughtObjectScale = this.boughtObjectActor.getLocalScale();
    this.boughtObjectAngles = this.boughtObjectActor.getLocalEulerAngles();
    
    this.buyNowActor = Sup.getActor("Buy Now");
    this.buyNowActor.spriteRenderer.setOpacity(0);
    
    Sup.getActor("Screen").setVisible(false);
    Sup.getActor("Updating").setVisible(false);
    this.errorActor = Sup.getActor("Error");

    let behavior = this;
    new Sup.Tween(this.actor, { "x": -2, "y": -0.5 })
      .to({ "x": 0.2, "y": 1 }, 1 * 1000)
      .onUpdate(function(object) {
        behavior.pushHandPosition.x = object.x;
        behavior.pushHandPosition.y = object.y;
        behavior.pushHandActor.setLocalPosition(behavior.pushHandPosition);
      })
      .onComplete(function() {
        behavior.canClick = true;
    
        if (Game.state.activeQuest === "finish") {
          Sup.getActor("Updating").setVisible(true)
          behavior.isBroken = true;
          behavior.outroTimer = behavior.outroDelay;
        }
        else {
          behavior.displayItem();
          behavior.textBehavior = new Sup.Actor("Text").addBehavior(TextBehavior);
          behavior.textBehavior.actor.setLocalPosition(new Sup.Math.Vector3(0, -3, 6));
          behavior.textBehavior.setText(Game.TextData.IntroBuy);
        }
      })
      .start();
    }
    
  update() {
    if (this.outroTimer > 0) {
      this.outroTimer -= 1;
      if (this.outroTimer === 0) {
        if (! this.isClicking) {
          Sup.loadScene(Sup.get("Credits/Scene", Sup.Scene));
          return
        }
        else { this.exitOutro = true; }
      }
    }
    if (this.canBuy) {
      this.clickTimer -= 1;
      if (this.clickTimer <= 0) { this.hideItem(); }
    }
    if (Sup.Input.wasMouseButtonJustPressed(0) && this.canClick) { this.click(); }
  }
    
  displayItem() {
    this.currentItem += 1;
    let object = this.objects[ this.currentItem ];
    this.objectActor.spriteRenderer.setSprite(Sup.get("Intro/" + object, Sup.Sprite));
    
    let behavior = this;
    new Sup.Tween(this.actor, { "scale": 0.001, "x": 1.5, "y": 1.5 })
      .to({ "scale": 1, "x": 3, "y": 1.7 }, 1 * 1000)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(function(object) {
        behavior.onMoveItemUpdate(object);
      })
      .onComplete(function() {
        behavior.canBuy = true;
        behavior.clickTimer = behavior.clickDelay;
      })
      .start();
    
    new Sup.Tween(this.actor, { "opacity": 0 })
      .to({ "opacity": 1 }, 0.2 * 1000)
      .yoyo(true)
      .repeat(20)
      .onUpdate(function(object) {
        behavior.buyNowActor.spriteRenderer.setOpacity(object.opacity);
      })
      .onComplete(function() {
        behavior.buyNowActor.spriteRenderer.setOpacity(0);
      })
      .start();
  }
   
  hideItem() {
    this.canBuy = false;
    
    let behavior = this;
    new Sup.Tween(this.actor, { "scale": 1, "x": 3, "y": 1.7 })
      .to({ "scale": 0.001, "x": 1.5, "y": 1.5 }, 0.5 * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function(object) {
        behavior.onMoveItemUpdate(object);
      })
      .onComplete(function() {
        behavior.onMoveItemComplete();
      })
      .start();
  }
  
  buyItem() {
    this.canBuy = false;
    Game.state.boughtItems[ this.objects[ this.currentItem ] ] = true;
    
    let behavior = this;
    new Sup.Tween(this.actor, { "scale": 1, "x": 3, "y": 1.7 })
      .to({ "scale": 0.001, "x": 4.5, "y": 2.5 }, 0.5 * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function(object) {
        behavior.onMoveItemUpdate(object);
      })
      .onComplete(function() {
        behavior.onMoveItemComplete();
        Sup.Audio.playSound("Intro/Cash");
      })
      .start();
  }
  
  onMoveItemUpdate(value) {
    this.objectScale.set(value.scale, value.scale, 1);
    this.objectActor.setLocalScale(this.objectScale);
    this.objectPosition.x = value.x;
    this.objectPosition.y = value.y;
    this.objectActor.setLocalPosition(this.objectPosition);
  }
  
  onMoveItemComplete() {
    if (this.currentItem >= this.objects.length - 1) { this.brokeDistritou(); }
    else { this.displayItem(); }
  }
  
  click() {
    if (this.textBehavior !== null) {
      this.textBehavior.actor.destroy()
      this.textBehavior = null;
    }
    
    let sound: Sup.Audio.SoundPlayer;
    if (this.isBroken) { sound = new Sup.Audio.SoundPlayer("Intro/Error Click Sound"); }
    else { sound = new Sup.Audio.SoundPlayer("Intro/Click Sound"); }
    sound.setVolume(0.3).play();
    
    this.canClick = false;
    this.isClicking = true;
    
    let behavior = this;
    new Sup.Tween(this.actor, { "angle": Sup.Math.toRadians(25) })
      .to({ "angle": Sup.Math.toRadians(-10) }, 0.2 * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function(object) {
        behavior.pushHandAngle = object.angle;
        behavior.pushHandActor.setLocalEulerZ(behavior.pushHandAngle);

        if (object.angle < 0) { behavior.buttonHandActor.spriteRenderer.setSprite(Sup.get("Intro/Button Hand Pressed", Sup.Sprite)); }
      })
      .onComplete(function() {
        behavior.canClick = true;
        behavior.isClicking = false;

        behavior.pushHandAngle = Sup.Math.toRadians(25);
        behavior.pushHandActor.setLocalEulerZ(behavior.pushHandAngle);

        behavior.buttonHandActor.spriteRenderer.setSprite(Sup.get("Intro/Button Hand", Sup.Sprite))

        if (behavior.exitIntro) {
          Game.music.stop();
          Game.music = null;
          Game.start();
        }
        else if (behavior.exitOutro) { Sup.loadScene(Sup.get("Credits/Scene", Sup.Scene)); }
        
        else if (behavior.canBuy) {
          behavior.buyItem();
          behavior.throwItem();
        }
      })
      .start();
  }
    
  throwItem() {
    Game.state.boughtItems[ this.objects[ this.currentItem ] ] = true;
    
    let object = this.objects[ this.currentItem ];
    this.boughtObjectActor.spriteRenderer.setSprite(Sup.get("Intro/" + object, Sup.Sprite))
    
    let behavior = this;
    new Sup.Tween(this.actor, { "scale": 0.001, "y": 1, "angle": 0 })
      .to({ "scale": 5, "y": -4, "angle": 3 * 360 }, 1 * 1000)
      .onUpdate(function(object) {
        let scale = Math.min(0.8, object.scale);
        behavior.boughtObjectScale.set(scale, scale, 1)
        behavior.boughtObjectActor.setLocalScale(behavior.boughtObjectScale);

        behavior.boughtObjectPosition.y = object.y;
        behavior.boughtObjectActor.setLocalPosition(behavior.boughtObjectPosition);

        behavior.boughtObjectAngles.z = object.angle;
        behavior.boughtObjectActor.setLocalEulerAngles(behavior.boughtObjectAngles);
      })
      .start();
  }
  
  brokeDistritou() {
    this.isBroken = true;
    Sup.Audio.playSound("Intro/Distritou Broken");
    
    Sup.getActor("Dowie").spriteRenderer.setSprite(Sup.get("Intro/Angry Dowie", Sup.Sprite));
    Sup.getActor("Screen").setVisible(true);
    
    let behavior = this;
    let tween = new Sup.Tween(this.actor, { opacity: 0 })
      .to({ "opacity": 1 }, 0.2 * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function(object) {
        behavior.errorActor.spriteRenderer.setOpacity(object.opacity);
      })
      .onComplete(function(object) {
        if (!object.isClicking) {
          Game.music.stop();
          Game.music = null;
          Game.start();
        }
        else { object.exitIntro = true; }
      })
      .start();
  }  
}
Sup.registerBehavior(IntroCameraBehavior);
