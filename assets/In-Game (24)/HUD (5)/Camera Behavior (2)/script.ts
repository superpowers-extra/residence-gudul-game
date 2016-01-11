class CameraBehavior extends Sup.Behavior {

  position = this.actor.getLocalPosition();

  offset = 2;

  blackscreenActor: Sup.Actor;
  blackscreenOpacity = 1;
  blackscreenTargetOpacity = 0;

  targetScene: string;
  targetActor: string;

  awake() {
    Game.cameraBehavior = this;
  }
    
  start() {
    this.blackscreenActor = this.actor.getChild("Blackscreen");
    this.blackscreenActor.setLocalScale(100, 100, 1);
  }

  update() {
    // Position
    if (Game.playerBehavior.position.x - this.offset > this.position.x) {
      this.position.x = Sup.Math.lerp(this.position.x, Game.playerBehavior.position.x - this.offset, 0.1);
    } else if (Game.playerBehavior.position.x + this.offset < this.position.x) {
      this.position.x = Sup.Math.lerp(this.position.x, Game.playerBehavior.position.x + this.offset, 0.1);
    }
    
    this.actor.setLocalPosition(this.position);
    
    // Fading
    if (this.blackscreenOpacity != this.blackscreenTargetOpacity) {
      this.blackscreenOpacity = Sup.Math.lerp(this.blackscreenOpacity, this.blackscreenTargetOpacity, 0.1);
      if (Math.abs(this.blackscreenOpacity - this.blackscreenTargetOpacity) < 0.01) {
        this.blackscreenOpacity = this.blackscreenTargetOpacity;
        
        if (this.blackscreenOpacity === 1) {
          Sup.getActor("Scene").destroy();
          Game.switchToScene(this.targetScene, this.targetActor);
          
          this.blackscreenOpacity = 2;
          this.blackscreenTargetOpacity = 0;
        
        } else if (this.blackscreenOpacity === 0) {
          if (!Game.dialogBehavior.isVisible) {
            Game.playerBehavior.canMove = true;
          }
        }
      }
      
      this.blackscreenActor.spriteRenderer.setOpacity(Sup.Math.clamp(this.blackscreenOpacity, 0, 1));
    }
    
    // Update music volume
    if (Game.music != null) {
      Game.musicVolume = Sup.Math.lerp(Game.musicVolume, Game.targetMusicVolume, 0.01);
      Game.music.setVolume(Game.musicVolume);
    }
    
    // Keys shortcut
    if (false) {
      if (Sup.Input.wasKeyJustPressed("L")) {
        Game.music.stop()
        Game.music = null;
        Game.musicAsset = null;
        Sup.loadScene(Sup.get("Language/Scene", Sup.Scene));
      }

      if (Sup.Input.wasKeyJustPressed("F")) {
        Game.state.activeQuest = "finish";
        this.transitionToScene("In-Game/Scenery/Floor 3/Hall/Prefab", "Player Door");
      }
    }
  }

  transitionToScene(scene: string, target: string) {
    this.targetScene = scene;
    this.targetActor = target;
    this.blackscreenTargetOpacity = 1;
    
    Game.playerBehavior.canMove = false;
    Game.playerBehavior.hoveredItem = null;
  }
}
Sup.registerBehavior(CameraBehavior);
