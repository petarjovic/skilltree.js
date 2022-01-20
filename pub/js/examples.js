"use strict";

const skillTree = new SkillTree({
  canvas: document.getElementById("skillTree"),
  title: "Sample Skill Tree",
  // free: true,
  respec: true,
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
        image:
          "https://www.svgrepo.com/show/47033/pulling-up-training-silhouette.svg",
        children: [
          new Perk({
            title: "20 Pull Ups",
            image:
              "https://www.svgrepo.com/show/47033/pulling-up-training-silhouette.svg",
            children: [
              new Perk({
                title: "30 Pull Ups",
                image:
                  "https://www.svgrepo.com/show/47033/pulling-up-training-silhouette.svg",
                children: [
                  new Perk({
                    title: "40 Pull Ups",
                    image:
                      "https://www.svgrepo.com/show/47033/pulling-up-training-silhouette.svg",
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
