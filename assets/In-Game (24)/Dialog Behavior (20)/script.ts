class DialogBehavior extends Sup.Behavior {
  mainTextBehavior: TextBehavior;
  
  isVisible = false;
  closedTimer = 10;
  previousTextId: string;
  previousRandomTextIndex = -1;
  faceSetSpriteRenderer: Sup.SpriteRenderer;

  choicesOrigin: Sup.Actor;
  choicesOriginPosition: Sup.Math.Vector3;
  choiceTextBehaviors: TextBehavior[] = [];
  choiceSelectActor: Sup.Actor;
  activeChoiceIndex = -1;
  textId: string;
  choiceIds: string[];
  
  awake() {
    Game.dialogBehavior = this;
  }

  start() {
    this.actor.setVisible(false);
    this.faceSetSpriteRenderer = this.actor.getChild("Face Set").spriteRenderer;
    
    this.mainTextBehavior = this.actor.getChild("Text").getBehavior(TextBehavior);
    this.mainTextBehavior.alignment = "left";
    
    this.choicesOrigin = this.actor.getChild("Choices");
    this.choicesOriginPosition = this.choicesOrigin.getLocalPosition();
    
    this.choiceSelectActor = this.actor.getChild("Select Choice");
    
    for (let i = 0; i < 5; i++) {
      let choiceActor = new Sup.Actor("Choice" + i, this.choicesOrigin);
      choiceActor.setLocalPosition(0.3 + Math.floor(i / 3) * 5, -i % 3 * 0.3, 0);
      let textBehavior = choiceActor.addBehavior(TextBehavior, {"delay": 0, "alignment": "left", "opacity": 0.5});
      this.choiceTextBehaviors.push(textBehavior);
    }   
  }

  update() {
    if (!this.isVisible) {
      this.closedTimer++;
      return;
    }
    
    // Hover choices
    if (this.choiceIds != null) {
      if (!this.mainTextBehavior.isOver()) {
        this.choicesOrigin.setVisible(false);
      } else {
        this.choicesOrigin.setVisible(true);
      
        let oldActiveChoiceIndex = this.activeChoiceIndex;

        if (Game.playerBehavior.mousePosition.y < -3.75 && Game.playerBehavior.mousePosition.y >= -3.75 - 0.3 * 3) {
          let choiceY = Math.min(this.choiceIds.length - 1, Math.floor(-(Game.playerBehavior.mousePosition.y + 3.75) / 0.3));

          let choiceX = 0;
          if (this.choiceIds.length > 3) {
            choiceX = Sup.Math.clamp(Math.floor((Game.playerBehavior.mousePosition.x + 7.5) / 5), 0, 1);
          }

          this.activeChoiceIndex = Math.min(choiceX * 3 + choiceY, this.choiceIds.length - 1);
        } else {
          this.activeChoiceIndex = -1;
        }

        if (this.activeChoiceIndex >= 0) {
          if (oldActiveChoiceIndex !== this.activeChoiceIndex) {
            new Sup.Audio.SoundPlayer(Game.hoverSound).play();
          }
          this.choiceSelectActor.setVisible(true);
          this.choiceSelectActor.setLocalPosition(-5.35 + Math.floor(this.activeChoiceIndex / 3) * 5, -this.activeChoiceIndex % 3 * 0.3 - 0.15, 1);
        } else {
          this.choiceSelectActor.setVisible(false);
        }
      }
    }
    
    // Skip text / close dialog
    if (Sup.Input.wasMouseButtonJustReleased(0)) {
      if (! this.mainTextBehavior.skipToEnd() && (this.choiceIds == null || this.activeChoiceIndex >= 0)) {
        if (this.choiceIds != null) {
          new Sup.Audio.SoundPlayer(Game.selectSound).play();
        }
        this.close();
        return;
      }
    }
  }
  
  show(characterId: string, textId: string, choiceIds: string[], dialogFinishBehavior?) {
    this.textId = textId;
    // this.textId is used in close()
    
    if (characterId === "Dowie_Thought") {
      characterId = "Dowie";
    } else {
      let voiceSound = Sup.get("SFX/Voices/" + characterId, Sup.Sound, { ignoreMissing: true });
      if (voiceSound !== null) new Sup.Audio.SoundPlayer(voiceSound).play();
    }
    
    this.isVisible = true;
    this.actor.setVisible(true);
    this.choiceIds = choiceIds;
    this.activeChoiceIndex = -1;
    
    this.choicesOrigin.setVisible(false);
    this.choiceSelectActor.setVisible(false);
    
    Game.playerBehavior.canMove = false;
    this.faceSetSpriteRenderer.setSprite(Sup.get("In-Game/Pnj/Face Sets/"+characterId, Sup.Sprite))
    
    let text = Game.TextData[textId];
    if (text == null) text = textId;
    
    if (Array.isArray(text)) {
      let randomTextIndex = Sup.Math.Random.integer(0, text.length - 1);
      
      // Ensure we don't pick the same text twice in a row
      while (text.length > 1 && this.previousTextId === textId && this.previousRandomTextIndex === randomTextIndex) {
        randomTextIndex = Sup.Math.Random.integer(0, text.length - 1);
      }
      
      this.previousRandomTextIndex = randomTextIndex;
      this.previousTextId = textId;
      
      text = text[randomTextIndex];
    }
      
    this.mainTextBehavior.setText(text, 45);
    
    if (choiceIds != null) {
      choiceIds.forEach((choiceId, i) => {
        this.choiceTextBehaviors[i].setText(Game.TextData[choiceId]);
      });
    }
    
    this["dialogFinishBehavior"] = dialogFinishBehavior;
  }
  
  close() {
    this.closedTimer = 0;
  
    this.isVisible = false;
    this.actor.setVisible(false);
    this.mainTextBehavior.setText("");
    Game.playerBehavior.canMove = true;
    
    for (let i = 0; i < 5; i++) {
      this.choiceTextBehaviors[i].setText("");
    }
  
    if (this["dialogFinishBehavior"] != null) {
      let choiceId = "";
      if (this.choiceIds != null) {
        choiceId = this.choiceIds[this.activeChoiceIndex];
      }
      
      let dialogFinishBehavior = this["dialogFinishBehavior"];
      this["dialogFinishBehavior"] = null;
      dialogFinishBehavior.finishDialog(this.textId, choiceId);
    }
  }
  
}
Sup.registerBehavior(DialogBehavior);
