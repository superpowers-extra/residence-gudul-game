class DowieOutroBehavior extends Sup.Behavior {
  start() {
    if (Game.state.activeQuest === "finish") { Game.dialogBehavior.show("Dowie", "Finish", null, this); }   
  }
  
  update() {
    if (Game.playerBehavior.autoPilot && Game.playerBehavior.moveTargetX == null) {
      Game.playerBehavior.autoPilot = false;
      Game.cameraBehavior.blackscreenTargetOpacity = 0.95;
    }
    
    if (Game.cameraBehavior.blackscreenOpacity === 0.95) {
      Game.music.stop();
      Sup.loadScene(Sup.get("Intro/Scene", Sup.Scene));
    }
  }
  
  finishDialog(textId: string, choiceId: string) { 
    Game.playerBehavior.canMove = false;
    Game.playerBehavior.autoPilot = true;
    Game.playerBehavior.moveTargetX = 3;
  }
}
Sup.registerBehavior(DowieOutroBehavior);
