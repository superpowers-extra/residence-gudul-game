class ElevatorButtonBehavior extends Sup.Behavior {
  awake() {
    this.actor["actionBehavior"] = this;
  }
  
  activate() {
    Game.dialogBehavior.show("Dowie", "ascenseur_entrer_question", ["ascenseur_entrer_choix_entrer", "ascenseur_entrer_choix_rester"], this);
  }
  
  finishDialog(textId: string, choiceId: string) {
    if (choiceId === "ascenseur_entrer_choix_entrer") {
      if (Game.state.wearingSkin) {
        Game.dialogBehavior.show("Dowie", "ElevatorSkin", null, this);
      
      } else {
        Game.cameraBehavior.transitionToScene("In-Game/Scenery/Elevator/Prefab", "Elevator Player Spawn");
      }
    
    } else if (textId === "ElevatorSkin") {
      Game.playerBehavior.actor.spriteRenderer.setSprite(Sup.get("In-Game/Player/Sprite", Sup.Sprite));
      Game.state.wearingSkin = false;
      Game.getItem("Skin");
      Game.cameraBehavior.transitionToScene("In-Game/Scenery/Elevator/Prefab", "Elevator Player Spawn");
    }
  }
}
Sup.registerBehavior(ElevatorButtonBehavior);
