"use strict";

const TestTree = new SkillTree({
  canvas: document.getElementById("canvas"),
  title: "Test",
  points: 5,
  root: new Perk({
    children: [
      new Perk({
        children: [new Perk({})],
      }),
      new Perk({
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
    ],
  }),
});

TestTree.initialize();
