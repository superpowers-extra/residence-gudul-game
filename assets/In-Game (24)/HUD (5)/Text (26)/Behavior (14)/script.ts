class TextBehavior extends Sup.Behavior {
  text = "";
  alignment = "center";
  opacity = 1;

  letterActors = [];
  timer = 0;
  delay = 2;
  lastShowedLetter = -1;
  
  awake() {
    this.actor.setLocalScale(new Sup.Math.Vector3(0.3, 0.3, 0.3));
    this.setText(this.text);
  }
  
  setText(text: string, wrapWidth?: number) {
    this.text = text;
    
    var index = 0;
    var indexX = 0;
    var indexY = 0;
    var nextSpaceIndex = text.indexOf(" ");
    
    while (index < Math.max(this.letterActors.length, this.text.length)) {
      if (index >= this.text.length) {
        // Destroy overflow letters
        this.letterActors[this.text.length].destroy();
        this.letterActors.splice(this.text.length, 1);
        continue
      }
      
      var code = this.text[index].charCodeAt(0) - 31;
      if (code === 1 && indexX === 0) {
        // Skip spaces at the beginning of a line
        this.text = this.text.substring(0, index) + this.text.substring(index + 1);
        continue
      }
      var letterActor: Sup.Actor;
      if (index >= this.letterActors.length) {
        // Add missing letter
        letterActor = new Sup.Actor("Letter", this.actor);
        
        new Sup.SpriteRenderer(letterActor, Sup.get("In-Game/HUD/Text/Font", Sup.Sprite))
        letterActor.spriteRenderer.setAnimation("Animation");
        letterActor.spriteRenderer.stopAnimation();

        this.letterActors.push(letterActor);
      }
      else { letterActor = this.letterActors[index]; }

      var position = new Sup.Math.Vector3(0, -indexY * 1.1, 0);
      if (this.alignment === "center") { position.x = -(this.text.length / 2 - indexX) * 0.8; }
      else if (this.alignment === "left") { position.x = indexX * 0.8; }
      else if (this.alignment === "right") { position.x = -(this.text.length - indexX) * 0.8; }
      
      letterActor.setLocalPosition(position);
      
      // Handle all weird characters
      if (code >= 128) {
        if (code === 201) code = 106;       // è
        else if (code === 202) code = 98;   // é
        else if (code === 203) code = 104;  // ê
        else if (code === 204) code = 105;  // ë
        else if (code === 193) code = 101;  // à
        else if (code === 200) code = 103;  // ç
        else if (code === 195) code = 99;   // â
        else if (code === 213) code = 115;  // ô
        else if (code === 220) code = 118;  // û
        else if (code === 8186) code = 8;   // ’
        else if (code === 8190) code = 3;   // "
        else {
          Sup.log("Unsupported character: " + this.text[index] + " (" + code + ")");
          code = 32;
        }
      }
        
      letterActor.spriteRenderer.setAnimationFrameTime(code - 1);
        
      if (this.delay === 0) { letterActor.spriteRenderer.setOpacity(this.opacity); }
      else { letterActor.spriteRenderer.setOpacity(0); }
      
      index += 1
      indexX += 1
      if (wrapWidth !== null && nextSpaceIndex === index) {
        nextSpaceIndex = text.indexOf(" ", index + 1);
        if (nextSpaceIndex === -1) { nextSpaceIndex = text.length; }
        
        var charsToNextBreak = nextSpaceIndex - index;
        
        if (indexX + charsToNextBreak > wrapWidth) {
          indexX = 0;
          indexY += 1
        }
      }
    } 
    
    this.timer = 0;
    this.lastShowedLetter = -1;
  }
  
  isOver() { return this.lastShowedLetter >= this.letterActors.length - 1 }
  
  skipToEnd() {
    if (this.isOver()) { return false }
      
    while (this.lastShowedLetter < this.letterActors.length - 1) {
      this.lastShowedLetter += 1;
      this.letterActors[this.lastShowedLetter].spriteRenderer.setOpacity(this.opacity);
    }
    
    return true
  }
  
  update() {
    if (this.lastShowedLetter >= this.letterActors.length - 1) { return }
      
    if (this.timer < this.delay) {
      this.timer += 1;
      if (this.timer === this.delay) {
        this.lastShowedLetter += 1;
        this.letterActors[this.lastShowedLetter].spriteRenderer.setOpacity(this.opacity);
        this.timer = 0;
      }
    }
  }
}
Sup.registerBehavior(TextBehavior);
