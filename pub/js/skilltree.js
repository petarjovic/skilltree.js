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

    const dpr = window.devicePixelRatio || 1;
    const bsr =
      this.ctx.webkitBackingStorePixelRatio ||
      this.ctx.mozBackingStorePixelRatio ||
      this.ctx.msBackingStorePixelRatio ||
      this.ctx.oBackingStorePixelRatio ||
      this.ctx.backingStorePixelRatio ||
      1;
    const ratio = dpr / bsr;

    this.canvas.width = 500 * ratio;
    this.canvas.height = 1000 * ratio;
    this.canvas.style.width = 500 + "px";
    this.canvas.style.height = 1000 + "px";
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.trueCanvasWidth = parseInt(this.canvas.style.width, 10);
  }

  initialize() {
    this.ctx.font = "32px Arial";
    this.ctx.textAlign = "center";

    //const titleWidth = this.ctx.measureText(this.title).width;
    this.ctx.fillText(this.title, this.trueCanvasWidth / 2, 25);

    if (!this.free) {
      this.ctx.font = "20px Arial";
      this.ctx.fillText(this.pointsText, this.trueCanvasWidth / 2, 50);
    }

    if (this.root != null) {
      this.root.zerothWalk(null, this, 0);
      this.root.firstWalk();
      this.root.secondWalk();
      this.root.thirdWalk();
    }

    this.ctx.fillStyle = "darkblue";
    this.ctx.fillRect(
      this.root.rect.x,
      this.root.rect.y,
      this.root.rect.height,
      this.root.rect.width
    );

    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.root.rect.x,
      this.root.rect.y,
      this.root.rect.height,
      this.root.rect.width
    );
  }

  addPoints(points) {
    if (!this.free) {
      this.points += points;
      const textMeasure = this.ctx.measureText(this.pointsText);
      console.log(textMeasure);
      this.ctx.fillStyle = "black";
      this.ctx.clearRect(0, 33, this.trueCanvasWidth, 20);
      this.pointsText = "Points: " + this.points.toString();
      this.ctx.fillText(this.pointsText, this.trueCanvasWidth / 2, 50);
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
    this.x += m;
  }

  thirdWalk() {
    this.rect = {
      x: this.x + this.parentTree.trueCanvasWidth / 2 - 75,
      y: this.level * 75 + 60,
      height: 50,
      width: 50,
    };

    this.children.forEach((perk) => {
      perk.thirdWalk();
    });

    //console.log(this.rect);

    if (this.parent !== null) {
      this.parentTree.ctx.beginPath();
      this.parentTree.ctx.moveTo(
        this.parent.rect.x + 25,
        this.parent.rect.y + 25
      );
      this.parentTree.ctx.lineTo(this.rect.x + 25, this.rect.y + 25);
      this.parentTree.ctx.stroke();
    }

    this.parentTree.ctx.fillStyle = "darkred";
    this.parentTree.ctx.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.height,
      this.rect.width
    );

    this.parentTree.ctx.lineWidth = 2;
    this.parentTree.ctx.strokeRect(
      this.rect.x,
      this.rect.y,
      this.rect.height,
      this.rect.width
    );

    this.parentTree.canvas.addEventListener("click", (e) => {
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

  drawPerk() {
    this.parentTree.ctx.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
    this.parentTree.ctx.lineWidth = 2;
    this.parentTree.ctx.strokeRect(
      this.rect.x,
      this.rect.y,
      this.rect.height,
      this.rect.width
    );
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
          this.parentTree.ctx.fillStyle = "darkred";
          this.children.forEach((perk) => {
            perk.drawPerk();
          });
        }

        this.parentTree.addPoints(this.cost);
        this.invested = false;
        this.parentTree.ctx.fillStyle = "darkblue";
        this.drawPerk();
      } else if (this.invested) {
        return -1;
      } else {
        this.parentTree.addPoints(-this.cost);
        this.invested = true;
        this.parentTree.ctx.fillStyle = "darkgreen";
        this.drawPerk();
        this.parentTree.ctx.fillStyle = "darkblue";
        this.children.forEach((perk) => {
          perk.drawPerk();
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
          this.parentTree.ctx.fillStyle = "darkred";
          this.children.forEach((perk) => {
            perk.drawPerk();
          });
        }

        this.invested = false;
        this.parentTree.ctx.fillStyle = "darkblue";
        this.drawPerk();
      } else if (this.invested) {
        return -1;
      } else {
        this.invested = true;
        this.parentTree.ctx.fillStyle = "darkgreen";
        this.drawPerk();
        this.parentTree.ctx.fillStyle = "darkblue";
        this.children.forEach((perk) => {
          perk.drawPerk();
        });
      }
    }
  }
}
