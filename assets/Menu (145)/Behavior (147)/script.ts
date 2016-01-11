class MenuBehavior extends Sup.Behavior {
  timer = -1;
  position = this.actor.getLocalPosition();
  targetY = 2.2;
  
  speed = 0.01;
  
  tweenStarted = false;
  titleActor: Sup.Actor;
  titleScale = new Sup.Math.Vector3(0.001, 0.001, 1);
  
  music: Sup.Audio.SoundPlayer;
  
  start() {
    if (Game.TextData === TextDataEn) {
      Sup.getActor("Title Murder").spriteRenderer.setSprite(Sup.get("Menu/Title Murder En", Sup.Sprite));
    }
      
    this.titleActor = Sup.getActor("Title");
    this.titleActor.setLocalScale(this.titleScale);
    
    this.music = new Sup.Audio.SoundPlayer("Music/Floor 0/Janitor");
    this.music.setVolume(0.3);
    this.music.play();
  }
  
  update() {
    if (this.timer > 0) {
      this.timer -= 1;
      if (this.timer === 0) {
        let textBehavior = new Sup.Actor("Text").addBehavior(TextBehavior);
        textBehavior.actor.setLocalPosition(0, -1, 6);
        textBehavior.setText(Game.TextData.Menu);
      }
      
      return;
    }
    
    else if (this.timer === 0) {
      if (Sup.Input.wasMouseButtonJustPressed(0)) {
        this.music.stop();
        Sup.loadScene(Sup.get("Pre-Intro/Scene", Sup.Scene));
      }
      return
    }
    
    if (this.position.y > this.targetY + this.speed) {
      if (this.position.y < 3 && !this.tweenStarted) {
        this.tweenStarted = true;

        let behavior = this;
        let tween = new Sup.Tween(this.actor, { "scale": 0.001 })
          .to({ "scale": 1 }, 1 * 1000)
          .easing(TWEEN.Easing.Elastic.Out)
          .onUpdate(function() {
            behavior.titleScale.set(this.scale, this.scale, 1);
            behavior.titleActor.setLocalScale(behavior.titleScale);
          })
          .start();
      }
      
      if (this.position.y < 8) this.speed = Sup.Math.lerp(this.speed, 0.01, 0.01);
      else this.speed = Sup.Math.lerp(this.speed, 0.08, 0.02);
      
      this.position.y -= this.speed;
      this.actor.setLocalPosition(this.position);
    } else {
      this.timer = 120;
    }
  }
}
Sup.registerBehavior(MenuBehavior);
