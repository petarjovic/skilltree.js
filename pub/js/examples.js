"use strict";

const skillTree = new SkillTree({
  canvas: document.getElementById("canvas"),
  title: "Sample Skill Tree",
  // free: true,
  // respec: true,
  points: 10,
  root: new Perk({
    title: "Attack 1",
    image: "https://freesvg.org/img/Sword-Grayscale.png",
    children: [
      new Perk({
        title: "Attack 2",
        image: "https://freesvg.org/img/Sword-Grayscale.png",
        children: [
          new Perk({
            title: "Attack 3",
            image: "https://freesvg.org/img/Sword-Grayscale.png",
            children: [
              new Perk({
                title: "Attack 4",
                image: "https://freesvg.org/img/Sword-Grayscale.png",
                children: [
                  new Perk({
                    title: "Attack 5",
                    image: "https://freesvg.org/img/Sword-Grayscale.png",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "Attack Speed",
        image: "https://freesvg.org/img/Wind--NicholasJudy456.png",
        children: [
          new Perk({
            title: "AS 2",
            image: "https://freesvg.org/img/Wind--NicholasJudy456.png",
            children: [
              new Perk({
                title: "AS 3",
                image: "https://freesvg.org/img/Wind--NicholasJudy456.png",
              }),
              new Perk({
                title: "AS 4",
                image: "https://freesvg.org/img/Wind--NicholasJudy456.png",
              }),
              new Perk({
                title: "AS 5",
                image: "https://freesvg.org/img/9va-Cartoon_Tornado.png",
                cost: 4,
              }),
            ],
          }),
          new Perk({
            title: "Multi Hit",
            image: "https://freesvg.org/img/9va-Cartoon_Tornado.png",
          }),
        ],
      }),
    ],
  }),
});

skillTree.initialize();
