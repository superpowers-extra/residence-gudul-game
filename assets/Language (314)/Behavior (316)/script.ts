class LanguageBehavior extends Sup.Behavior {
  frenchActor: Sup.Actor;
  englishActor: Sup.Actor;

  hovered = "none";

  start() {
    this.frenchActor = Sup.getActor("French");
    this.englishActor = Sup.getActor("English");
  }
  
  update() {
    let mousePosition = Sup.Input.getMousePosition();
    
    let hovered = "";
    if (mousePosition.x < 0) {
      hovered = "french";
      this.frenchActor.spriteRenderer.setColor(1.5, 1.5, 1.5);
      this.englishActor.spriteRenderer.setColor(1, 1, 1);
      
      if (Sup.Input.wasMouseButtonJustReleased(0)) {
        Sup.Audio.playSound("SFX/Select");
        Game.TextData = TextDataFr;
        Sup.loadScene(Sup.get("Menu/Scene", Sup.Scene));
      }
    } else {
      hovered = "english";
      this.englishActor.spriteRenderer.setColor(1.5, 1.5, 1.5);
      this.frenchActor.spriteRenderer.setColor(1, 1, 1);

      if (Sup.Input.wasMouseButtonJustReleased(0)) {
        Sup.Audio.playSound("SFX/Select");
        Game.TextData = TextDataEn;
        Sup.loadScene(Sup.get("Menu/Scene", Sup.Scene));
      }
    }
    if (hovered !== this.hovered) {
      this.hovered = hovered;
      Sup.Audio.playSound("SFX/Hover");
    }
  }
}
Sup.registerBehavior(LanguageBehavior);
