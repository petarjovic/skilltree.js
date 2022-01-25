"use strict";

const skillTree = new SkillTree({
  canvas: document.getElementById("skillTree"),
  title: "Warrior Skill Tree",
  // free: true,
  respec: true,
  points: 30,
  root: new Perk({
    title: "Attack 1",
    image: "https://www.svgrepo.com/show/276072/sword.svg",
    children: [
      new Perk({
        title: "Attack 2",
        image: "https://www.svgrepo.com/show/276072/sword.svg",
        cost: 2,
        children: [
          new Perk({
            title: "Attack 3",
            image: "https://www.svgrepo.com/show/276072/sword.svg",
            cost: 3,
            children: [
              new Perk({
                title: "Attack 4",
                image: "https://www.svgrepo.com/show/276072/sword.svg",
                cost: 4,
                children: [
                  new Perk({
                    title: "Attack 5",
                    cost: 10,
                    image: "https://www.svgrepo.com/show/275522/sword.svg",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "Block 1",
        image: "https://www.svgrepo.com/show/276068/shield.svg",
        children: [
          new Perk({
            title: "Block 2",
            image: "https://www.svgrepo.com/show/276068/shield.svg",
            cost: 2,
            children: [
              new Perk({
                title: "Block 3",
                cost: 3,
                image: "https://www.svgrepo.com/show/276068/shield.svg",
                children: [
                  new Perk({
                    title: "Block 4",
                    cost: 4,
                    image: "https://www.svgrepo.com/show/276068/shield.svg",
                  }),
                ],
              }),
            ],
          }),
          new Perk({
            title: "Parry",
            image: "https://www.svgrepo.com/show/276071/sword.svg",
            cost: 3,
            children: [
              new Perk({
                title: "Parry 2",
                image: "https://www.svgrepo.com/show/276071/sword.svg",
                cost: 4,
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "Attack Speed",
        cost: 2,
        image: "https://www.svgrepo.com/show/235564/wind.svg",
        children: [
          new Perk({
            title: "Attack Speed 2",
            cost: 2,
            image: "https://www.svgrepo.com/show/235564/wind.svg",
            children: [
              new Perk({
                title: "Attack Speed 3",
                cost: 3,
                image: "https://www.svgrepo.com/show/235564/wind.svg",
              }),
              new Perk({
                title: "Multi Hit",
                image: "https://www.svgrepo.com/show/223553/tornado.svg",
                cost: 5,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
});

const workoutTree = new SkillTree({
  canvas: document.getElementById("exerciseTree"),
  title: "Exercises",
  free: true,
  root: new Perk({
    title: "10 Push Ups",
    image: "https://www.svgrepo.com/show/9896/push-up.svg",
    children: [
      new Perk({
        title: "20 Push Ups",
        image: "https://www.svgrepo.com/show/9896/push-up.svg",
        children: [
          new Perk({
            title: "30 Pull Ups",
            image: "https://www.svgrepo.com/show/9896/push-up.svg",
            children: [
              new Perk({
                title: "40 Pull Ups",
                image: "https://www.svgrepo.com/show/9896/push-up.svg",
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "10 Pull Ups",
        image: "https://www.svgrepo.com/show/212752/pull-up-gym.svg",
        children: [
          new Perk({
            title: "20 Pull Ups",
            image: "https://www.svgrepo.com/show/212752/pull-up-gym.svg",
            children: [
              new Perk({
                title: "30 Pull Ups",
                image: "https://www.svgrepo.com/show/212752/pull-up-gym.svg",
                children: [
                  new Perk({
                    title: "40 Pull Ups",
                    image:
                      "https://www.svgrepo.com/show/212752/pull-up-gym.svg",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "10 Min Run",
        image: "https://www.svgrepo.com/show/119363/running.svg",
        children: [
          new Perk({
            title: "20 Min Run",
            image: "https://www.svgrepo.com/show/119363/running.svg",
            children: [
              new Perk({
                title: "30 Min Run",
                image: "https://www.svgrepo.com/show/119363/running.svg",
                children: [],
              }),
            ],
          }),
        ],
      }),
      new Perk({
        title: "10 Sit Ups",
        image: "https://www.svgrepo.com/show/30271/fitness.svg",
        children: [
          new Perk({
            title: "20 Sit Ups",
            image: "https://www.svgrepo.com/show/30271/fitness.svg",
            children: [
              new Perk({
                title: "30 Sit Ups",
                image: "https://www.svgrepo.com/show/30271/fitness.svg",
              }),
            ],
          }),
        ],
      }),
    ],
  }),
});

skillTree.initialize();
workoutTree.initialize();
