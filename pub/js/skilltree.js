"use strict";

class SkillTree {
  constructor({
    canvas,
    title = "",
    desc = "",
    points = 0,
    root = null,
    respec = false,
    free = false,
  }) {
    this.canvas = canvas;
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.ctx = this.canvas.getContext("2d");
    this.title = title;
    this.desc = desc;
    this.points = points;
    this.pointsText = "Points: " + this.points.toString();

    this.nextIdNum = 0;

    this.root = root;
    this.free = free;
    this.respec = respec;

    this.distance = 100;

    //below code ensures that the canvas isn't blurry (hopefully)
  }

  initialize() {
    if (this.root != null) {
      this.root.zerothWalk(null, this, 0);
      this.root.firstWalk();
      this.root.secondWalk();

      //*This code ensures that the canvas is sharp on all devices... hopefully*/
      const ratio = window.devicePixelRatio;

      this.canvas.style.width = this.canvas.width + "px";
      this.canvas.style.height = this.canvas.height + "px";
      this.canvas.width *= ratio;
      this.canvas.height *= ratio;

      this.trueCanvasWidth = parseInt(this.canvas.style.width, 10);

      this.ctx.scale(ratio, ratio);
      //*********/

      this.ctx.font = "bold 36px Trebuchet MS";
      this.ctx.textAlign = "center";

      //const titleWidth = this.ctx.measureText(this.title).width;
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = "white";
      this.ctx.fillText(this.title, this.trueCanvasWidth / 2, 32);
      this.ctx.strokeText(this.title, this.trueCanvasWidth / 2, 32);

      if (!this.free) {
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 20px Trebuchet MS";
        this.ctx.fillText(this.pointsText, this.trueCanvasWidth / 2, 60);
      }

      console.log(this.canvas);

      this.root.thirdWalk();
    }

    this.ctx.fillStyle = "darkblue";
    this.root.drawPerk();
  }

  addPoints(points) {
    if (!this.free) {
      this.points += points;
      //   const textMeasure = this.ctx.measureText(this.pointsText);
      //   console.log(textMeasure);
      this.ctx.fillStyle = "black";
      this.ctx.clearRect(0, 41, this.trueCanvasWidth, 25);
      this.pointsText = "Points: " + this.points.toString();
      this.ctx.font = "bold 20px Trebuchet MS";
      this.ctx.fillText(this.pointsText, this.trueCanvasWidth / 2, 60);
    }
  }
}

class Perk {
  constructor({ title = "", desc = "", cost = 1, children = [], image = "" }) {
    this.title = title;
    this.desc = desc;
    this.cost = cost;
    this.children = children;
    this.image = image;

    this.invested = false;
    this.rect = { x: 0, y: 0, height: 0, width: 0 };
    this.parentTree = null;

    this.leftSibling = null;
    this.thread = null;
    this.ancestor = null;
    this.x = 0;
    this.level = 0;
    this.mod = 0;
    this.change = 0;
    this.shift = 0;
    this.siblingOrderNum = 0;
  }

  zerothWalk(parent, parentTree, level) {
    this.parentTree = parentTree;
    this.parent = parent;
    this.level = level;
    console.log(this);
    this.children.forEach((perk, i) => {
      perk.siblingOrderNum = i;
      if (i > 0) {
        perk.leftSibling = this.children[i - 1];
      }
      perk.zerothWalk(this, parentTree, level + 1);
    });
  }

  firstWalk() {
    if (this.children.length === 0) {
      if (this.leftSibling === null) {
        return;
      } else {
        this.x = this.leftSibling.x + this.parentTree.distance;
        return;
      }
    }

    let defaultAncestor = this.children[0];

    this.children.forEach((perk) => {
      perk.firstWalk();
      defaultAncestor = perk.apportion(defaultAncestor);
    });

    this.executeShifts();

    const midpoint = (this.children[0].x + this.children.at(-1).x) / 2;

    if (this.leftSibling !== null) {
      this.x = this.leftSibling.x + this.parentTree.distance;
      this.mod = this.x - midpoint;
    } else {
      this.x = midpoint;
    }
  }

  apportion(defaultAncestor) {
    if (this.leftSibling !== null) {
      let leftmostSibling = this.parent.children[0];

      let vIright = this;
      let vOright = this;
      let vIleft = this.leftSibling;
      let vOleft = leftmostSibling;

      let sIright = vIright.mod;
      let sOright = vOright.mod;
      let sIleft = vIleft.mod;
      let sOleft = vOleft.mod;

      while (vIleft.nextRight() !== null && vIright.nextLeft() !== null) {
        vIleft = vIleft.nextRight();
        vIright = vIright.nextLeft();
        vOleft = vOleft.nextLeft();
        vOright = vOright.nextRight();
        vOright.ancestor = this;

        let shift =
          vIleft.x + sIleft - (vIright.x + sIright) + this.parentTree.distance;

        if (shift > 0) {
          let a = this.getAncestor(vIleft, defaultAncestor);
          this.moveSubtree(a, shift);
          sIright += shift;
          sOright += shift;
        }

        sIleft += vIleft.mod;
        sIright += vIright.mod;
        sOleft += vOleft.mod;
        sOright += vOright.mod;
      }

      if (vIleft.nextRight() !== null && vOright.nextRight() === null) {
        vOright.thread = vIleft.nextRight();
        vOright.mod += sIleft - sOright;
      } else {
        if (vIright.nextLeft() !== null && vOright.nextLeft() === null) {
          vOleft.thread = vIright.nextLeft();
          vOleft.mod += sIleft - sOleft;
        }

        defaultAncestor = this;
      }
    }

    return defaultAncestor;
  }

  nextLeft() {
    if (this.children.length > 0) {
      return this.children[0];
    } else {
      return this.thread;
    }
  }

  nextRight() {
    if (this.children.length > 0) {
      return this.children.at(-1);
    } else {
      return this.thread;
    }
  }

  moveSubtree(uA, shift) {
    let numSubtrees = this.siblingOrderNum - uA.siblingOrderNum;
    let shiftBySubtrees = shift / numSubtrees;

    this.change -= shiftBySubtrees;
    uA.change += shiftBySubtrees;

    this.shift += shift;
    this.x += shift;
    this.mod += shift;
  }

  executeShifts() {
    let shift = 0;
    let change = 0;

    this.children
      .slice()
      .reverse()
      .forEach((perk) => {
        perk.x += shift;
        perk.mod += shift;
        change += perk.change;
        shift += perk.shift + change;
      });
  }

  getAncestor(vIleft, defaultAncestor) {
    if (this.parent.children.includes(vIleft.ancestor)) {
      return vIleft.ancestor;
    } else {
      return defaultAncestor;
    }
  }

  secondWalk(m = 0) {
    this.children.forEach((perk) => {
      perk.secondWalk(m + this.mod);
    });
    this.x += m + 20;

    if (this.x + 100 > this.parentTree.canvas.width) {
      this.parentTree.canvas.width = this.x + 70;
    }
    if (this.level * 85 + 60 + 80 > this.parentTree.canvas.height) {
      this.parentTree.canvas.height = this.level * 85 + 60 + 80;
    }
  }

  thirdWalk() {
    this.rect = {
      x: this.x,
      y: this.level * 85 + 70,
      height: 50,
      width: 50,
    };

    this.children.forEach((perk) => {
      perk.thirdWalk();
    });

    //console.log(this.rect);

    if (this.parent !== null) {
      this.parentTree.ctx.lineWidth = 1.5;
      this.parentTree.ctx.beginPath();
      this.parentTree.ctx.moveTo(
        this.parent.rect.x + 25,
        this.parent.rect.y + 25
      );
      this.parentTree.ctx.lineTo(this.rect.x + 25, this.rect.y + 25);
      this.parentTree.ctx.stroke();
    }

    this.drawPerk("darkred");

    this.parentTree.canvas.addEventListener("click", (e) => {
      //   let canvasBounds = this.parentTree.canvas.getBoundingRect();
      //   let scaleX = this.parentTree.canvas.width / canvasBounds.width;
      //   let scaleY = this.parentTree.canvas.height / canvasBounds.height;
      const pos = {
        x: e.clientX,
        y: e.clientY,
      };

      if (this.isIntersect(pos)) {
        this.invest();
      }
    });
  }

  isIntersect(pos) {
    return (
      pos.x > this.rect.x &&
      pos.x < this.rect.x + this.rect.width &&
      pos.y < this.rect.y + this.rect.height &&
      pos.y > this.rect.y
    );
  }

  drawPerk(background) {
    this.parentTree.ctx.fillStyle = background;
    this.parentTree.ctx.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
    if (this.image.length !== 0) {
      const img = new Image();
      img.onload = () => {
        this.parentTree.ctx.drawImage(img, this.rect.x, this.rect.y, 50, 50);
      };
      img.src = this.image;
    }
    this.parentTree.ctx.lineWidth = 2;
    this.parentTree.ctx.strokeRect(
      this.rect.x,
      this.rect.y,
      this.rect.height,
      this.rect.width
    );
    if (!this.parentTree.free) {
      this.parentTree.ctx.font = "12px Trebuchet MS";
      this.parentTree.ctx.fillStyle = "white";
      this.parentTree.ctx.fillText(
        this.cost.toString(),
        this.rect.x + 42,
        this.rect.y + 47
      );
    }
    if (this.title.length !== 0) {
      this.parentTree.ctx.font = "bold 16px Trebuchet MS";
      //   this.parentTree.ctx.fillStyle = "grey";
      //   this.parentTree.ctx.globalAlpha = 0.5;
      //   this.parentTree.ctx.fillRect(this.rect.x - 2, this.rect.y + 50, 52, 15);
      //   this.parentTree.ctx.globalAlpha = 1.0;
      this.parentTree.ctx.fillStyle = "black";
      //   this.parentTree.ctx.strokeRect(this.rect.x, this.rect.y + 50, 50, 15);
      this.parentTree.ctx.clearRect(this.rect.x - 5, this.rect.y + 52, 60, 16);
      this.parentTree.ctx.lineWidth = 1;
      this.parentTree.ctx.fillText(
        this.title,
        this.rect.x + 25,
        this.rect.y + 64
      );
      //   this.parentTree.ctx.strokeText(
      //     this.title,
      //     this.rect.x + 25,
      //     this.rect.y + 64
      //   );
    }
    //this.parentTree.ctx.fillStyle = fillStyle;
  }

  invest() {
    if (!this.parentTree.free) {
      if (!this.invested && this.parentTree.points < this.cost) {
        alert("Not enough points.");
        return -1;
      } else if (this.parent != null && !this.parent.invested) {
        alert("Did not unlock prerequesite skill.");
        return -1;
      } else if (this.parentTree.respec && this.invested) {
        if (this.children.length > 0) {
          for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].invested) {
              alert("Please refund all dependent perks first.");
              return -1;
            }
          }
          this.children.forEach((perk) => {
            perk.drawPerk("darkred");
          });
        }

        this.parentTree.addPoints(this.cost);
        this.invested = false;
        this.drawPerk("darkblue");
      } else if (this.invested) {
        return -1;
      } else {
        this.parentTree.addPoints(-this.cost);
        this.invested = true;
        this.drawPerk("darkgreen");
        this.children.forEach((perk) => {
          perk.drawPerk("darkblue");
        });
        return this.cost;
      }
    } else {
      if (this.parent != null && this.parent.invested === false) {
        alert("Did not unlock prerequesite skill.");
        return -1;
      } else if (this.parentTree.respec && this.invested) {
        if (this.children.length > 0) {
          for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].invested) {
              alert("Please refund all dependent perks first.");
              return -1;
            }
          }
          this.children.forEach((perk) => {
            perk.drawPerk("darkred");
          });
        }

        this.invested = false;
        this.drawPerk("darkblue");
      } else if (this.invested) {
        return -1;
      } else {
        this.invested = true;
        this.drawPerk("darkgreen");
        this.children.forEach((perk) => {
          perk.drawPerk("darkblue");
        });
      }
    }
  }
}
