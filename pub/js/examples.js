"use strict";

const TestTree = new SkillTree({
  canvas: document.getElementById("canvas"),
  title: "Sample Skill Tree",
  points: 500,
  root: new Perk({
    image: "https://freesvg.org/img/Sword-Grayscale.png",
    cost: 10,
    title: "Attack 1",
    children: [
      new Perk({
        children: [new Perk({})],
      }),
      new Perk({
        title: "JHksdjfKH",
        children: [
          new Perk({
            children: [
              new Perk({
                children: [new Perk({}), new Perk({})],
              }),
            ],
          }),
        ],
      }),
      new Perk({ children: [new Perk({})] }),
      new Perk({ cost: 99 }),
      new Perk({ children: [new Perk({})] }),
    ],
  }),
});

TestTree.initialize();
