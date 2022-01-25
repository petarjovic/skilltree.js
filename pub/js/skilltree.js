"use strict";
/**
 * Parent class used to create a skill tree.
 * 
 * @param {Object} properties - The properties of the skill tree.
 * @param {String} [properties.title=""] - The title of the skill tree.
 * @param {String} [properties.desc=""] - The skill tree's description (currently not implemented).
 * @param {Number} [properties.points=0] - The number of points the user has to spend at the start.
 * @param {Perk} [properties.root=null] - An instance of the Perk class which will be root of the tree.
 * @param {Boolean} [properties.respec=false] - If true it will be possible to refund and relock Perks in this tree after they've been unlocked.
 * @param {Boolean} [properties.free=false] - If true all perks in this tree will be free (their cost and the amount of points will not matter).
 */
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

  }

  /**
   * This method cacluates and draws the skill tree on the canvas element according to the
   * specfications given when creating the SkillTree instance.
   * This method must be called after finishing creation of the skill tree.
   */
  initialize() {
    if (this.root != null) {
      this.root.zerothWalk(null, this, 0);
      this.root.firstWalk();
      this.root.secondWalk();

      /*This code ensures that the canvas is sharp on all devices (hopefully).*/
      const ratio = window.devicePixelRatio;

      this.canvas.style.width = this.canvas.width + "px";
      this.canvas.style.height = this.canvas.height + "px";
      this.canvas.width *= ratio;
      this.canvas.height *= ratio;

      this.trueCanvasWidth = parseInt(this.canvas.style.width, 10);

      this.ctx.scale(ratio, ratio);
      //**********************************************************************/

      this.ctx.font = "bold 36px Trebuchet MS";
      this.ctx.textAlign = "center";


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

  /**
   * Adds points to the skill tree.
   * 
   * @param {Number} points - The positive or negative value of points to be added this SkillTree instance's points.
   */
  addPoints(points) {
    if (!this.free) {
      this.points += points;
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

  /** The following methods are all more or less implementations of functions described by Christoph Buchheim et al. in 
   * "Imporiving Walker's Algorithm to Run in Linear Time", linked here http://dirk.jivas.de/papers/buchheim02improving.pdf
   * */

  /**
   * This method is the first walk through the skill tree, sets up values needed for later walks, 
   * always called on the root element of the parent SkillTree instance. 
   * 
   * @param {*} parent - The parent perk, passed in as null for root perk since it has no parents.
   * @param {*} parentTree - An instance of the SkillTree class which is the Perk.parentTree of all Perks in the tree.
   * @param {*} level  - The level of the node, passed in as 0 at the root perk.
   */
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

  /**
   * First walk in the tree drawing algorthim, calculates some of the necessary values to calculate the position of Perks.
   */
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

  /**
   * Used internerally in the tree drawing algorithm.
   */
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

  /**
   * Used internerally in the tree drawing algorithm.
   */
  nextLeft() {
    if (this.children.length > 0) {
      return this.children[0];
    } else {
      return this.thread;
    }
  }

  /**
   * Used internerally in the tree drawing algorithm.
   */
  nextRight() {
    if (this.children.length > 0) {
      return this.children.at(-1);
    } else {
      return this.thread;
    }
  }

  /**
   * Used internerally in the tree drawing algorithm.
   */
  moveSubtree(uA, shift) {
    let numSubtrees = this.siblingOrderNum - uA.siblingOrderNum;
    let shiftBySubtrees = shift / numSubtrees;

    this.change -= shiftBySubtrees;
    uA.change += shiftBySubtrees;

    this.shift += shift;
    this.x += shift;
    this.mod += shift;
  }

  /**
   * Used internerally in the tree drawing algorithm.
   */
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

  /**
   * Used internerally in the tree drawing algorithm.
   */
  getAncestor(vIleft, defaultAncestor) {
    if (this.parent.children.includes(vIleft.ancestor)) {
      return vIleft.ancestor;
    } else {
      return defaultAncestor;
    }
  }

  /**
   * Secondwalk in the drawing algorithm, calculates the size of the canvas and the correct positions of the Perks.
   * 
   * @param {Number} m - Used internally to pass the mod value, do not actualy pass this value in.
   */
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

  /**
   * The third walkthrough the tree draws the rectangles and adds click events in the correct place.
   */
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
      const canvasRect = this.parentTree.canvas.getBoundingClientRect();
      const pos = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };

      if (this.isIntersect(pos)) {
        this.invest();
      }
    });
  }
  /*************** Implemenation of tree drawing algorithm ends here. *********************/

  /**
   * This function checks wheter or not the mouse is within a perk on click.
   * 
   * @param {Object} pos.x - Current x position of the mouse.
   * @param {Object} pos.y - Current y position of the mouse.
   * @returns {Boolean}
   */
  isIntersect(pos) {
    return (
      pos.x > this.rect.x &&
      pos.x < this.rect.x + this.rect.width &&
      pos.y < this.rect.y + this.rect.height &&
      pos.y > this.rect.y
    );
  }

  /**
   * Draws the 50x50 perk on the canvas according to the Perk.rect parameter.
   * 
   * @param {color} perkcolour - The background color of the Perk being drawn, typically either "darkred", "darkblue", or "green".
   */
  drawPerk(perkcolour) {
    this.parentTree.ctx.fillStyle = perkcolour;
    this.parentTree.ctx.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
    if (this.image.length !== 0) {
      const img = new Image();
      img.onload = () => {
        this.parentTree.ctx.drawImage(
          img,
          this.rect.x + 1,
          this.rect.y + 1,
          48,
          48
        );
        if (!this.parentTree.free) {
          this.parentTree.ctx.font = "13px Trebuchet MS";
          this.parentTree.ctx.fillStyle = "white";
          this.parentTree.ctx.fillText(
            this.cost.toString(),
            this.rect.x + 42,
            this.rect.y + 47
          );
        }
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
      this.parentTree.ctx.font = "13px Trebuchet MS";
      this.parentTree.ctx.fillStyle = "white";
      this.parentTree.ctx.fillText(
        this.cost.toString(),
        this.rect.x + 42,
        this.rect.y + 47
      );
    }
    if (this.title.length !== 0) {
      this.parentTree.ctx.font = "bold 16px Trebuchet MS";
      this.parentTree.ctx.fillStyle = "black";
      this.parentTree.ctx.clearRect(this.rect.x - 5, this.rect.y + 52, 60, 16);
      this.parentTree.ctx.lineWidth = 1;
      this.parentTree.ctx.fillText(
        this.title,
        this.rect.x + 25,
        this.rect.y + 64
      );
    }
  }

  /**
   * This method attempts to "invest" in this Perk instance in skill tree.
   * I.e. it does all the checks to see if the perk can be unlocked by the user at the moment.
   * 
   * @returns -1 if uncessusful in investing in Perk.
   */
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
