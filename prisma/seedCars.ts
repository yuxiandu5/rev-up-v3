import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // BMW
  await prisma.make.upsert({
    where: { slug: "bmw" },
    update: {},
    create: {
      name: "BMW",
      slug: "bmw",
      models: {
        create: [
          {
            name: "3 Series",
            slug: "3-series",
            badges: {
              create: [
                {
                  name: "320i",
                  slug: "320i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2013,
                        endYear: 2018,
                        chassis: "F30",
                        hp: 184,
                        torque: 270,
                        zeroToHundred: 74, // 7.4s
                        handling: 7,
                      },
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "G20",
                        hp: 184,
                        torque: 300,
                        zeroToHundred: 74, // 7.4s
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "330i",
                  slug: "330i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2013,
                        endYear: 2018,
                        chassis: "F30",
                        hp: 252,
                        torque: 350,
                        zeroToHundred: 56, // 5.6s
                        handling: 8,
                      },
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "G20",
                        hp: 258,
                        torque: 400,
                        zeroToHundred: 59, // 5.9s
                        handling: 8,
                      },
                    ],
                  },
                },
                {
                  name: "M340i",
                  slug: "m340i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "G20",
                        hp: 374,
                        torque: 500,
                        zeroToHundred: 44, // 4.4s
                        handling: 9,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "2 Series",
            slug: "2-series",
            badges: {
              create: [
                {
                  name: "220i",
                  slug: "220i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2014,
                        endYear: 2021,
                        chassis: "F22",
                        hp: 184,
                        torque: 270,
                        zeroToHundred: 71, // 7.1s
                        handling: 7,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 184,
                        torque: 300,
                        zeroToHundred: 72, // 7.2s
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "230i",
                  slug: "230i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2016,
                        endYear: 2021,
                        chassis: "F22",
                        hp: 252,
                        torque: 350,
                        zeroToHundred: 57,
                        handling: 8,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 245,
                        torque: 400,
                        zeroToHundred: 58,
                        handling: 8,
                      },
                    ],
                  },
                },
                {
                  name: "M240i",
                  slug: "m240i",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2016,
                        endYear: 2021,
                        chassis: "F22",
                        hp: 340,
                        torque: 500,
                        zeroToHundred: 46,
                        handling: 9,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 374,
                        torque: 500,
                        zeroToHundred: 44,
                        handling: 9,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Mercedes
  await prisma.make.upsert({
    where: { slug: "mercedes" },
    update: {},
    create: {
      name: "Mercedes-Benz",
      slug: "mercedes",
      models: {
        create: [
          {
            name: "C-Class",
            slug: "c-class",
            badges: {
              create: [
                {
                  name: "C200",
                  slug: "c200",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2014,
                        endYear: 2021,
                        chassis: "W205",
                        hp: 184,
                        torque: 300,
                        zeroToHundred: 77,
                        handling: 7,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 204,
                        torque: 300,
                        zeroToHundred: 75,
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "C300",
                  slug: "c300",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2015,
                        endYear: 2021,
                        chassis: "W205",
                        hp: 258,
                        torque: 370,
                        zeroToHundred: 59,
                        handling: 8,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 258,
                        torque: 400,
                        zeroToHundred: 60,
                        handling: 8,
                      },
                    ],
                  },
                },
                {
                  name: "C43 AMG",
                  slug: "c43-amg",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2016,
                        endYear: 2021,
                        chassis: "W205",
                        hp: 367,
                        torque: 520,
                        zeroToHundred: 47,
                        handling: 9,
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 390,
                        torque: 520,
                        zeroToHundred: 47,
                        handling: 9,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "A-Class",
            slug: "a-class",
            badges: {
              create: [
                {
                  name: "A180",
                  slug: "a180",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2018,
                        endYear: null,
                        chassis: "W177",
                        hp: 136,
                        torque: 200,
                        zeroToHundred: 91,
                        handling: 6,
                      },
                    ],
                  },
                },
                {
                  name: "A200",
                  slug: "a200",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2018,
                        endYear: null,
                        chassis: "W177",
                        hp: 163,
                        torque: 250,
                        zeroToHundred: 82,
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "A250",
                  slug: "a250",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2018,
                        endYear: null,
                        chassis: "W177",
                        hp: 224,
                        torque: 350,
                        zeroToHundred: 62,
                        handling: 8,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Audi
  await prisma.make.upsert({
    where: { slug: "audi" },
    update: {},
    create: {
      name: "Audi",
      slug: "audi",
      models: {
        create: [
          {
            name: "A4",
            slug: "a4",
            badges: {
              create: [
                {
                  name: "A4 40 TFSI",
                  slug: "a4-40-tfsi",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2016,
                        endYear: null,
                        chassis: "B9",
                        hp: 190,
                        torque: 320,
                        zeroToHundred: 74,
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "A4 45 TFSI",
                  slug: "a4-45-tfsi",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "B9.5",
                        hp: 265,
                        torque: 370,
                        zeroToHundred: 58,
                        handling: 8,
                      },
                    ],
                  },
                },
                {
                  name: "S4",
                  slug: "s4",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2016,
                        endYear: null,
                        chassis: "B9",
                        hp: 354,
                        torque: 500,
                        zeroToHundred: 48,
                        handling: 9,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "A5",
            slug: "a5",
            badges: {
              create: [
                {
                  name: "A5 40 TFSI",
                  slug: "a5-40-tfsi",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2017,
                        endYear: null,
                        chassis: "B9",
                        hp: 190,
                        torque: 320,
                        zeroToHundred: 76,
                        handling: 7,
                      },
                    ],
                  },
                },
                {
                  name: "A5 45 TFSI",
                  slug: "a5-45-tfsi",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2017,
                        endYear: null,
                        chassis: "B9.5",
                        hp: 265,
                        torque: 370,
                        zeroToHundred: 59,
                        handling: 8,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Porsche
  await prisma.make.upsert({
    where: { slug: "porsche" },
    update: {},
    create: {
      name: "Porsche",
      slug: "porsche",
      models: {
        create: [
          {
            name: "911",
            slug: "911",
            badges: {
              create: [
                {
                  name: "Carrera",
                  slug: "carrera",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "992",
                        hp: 385,
                        torque: 450,
                        zeroToHundred: 42,
                        handling: 10,
                      },
                    ],
                  },
                },
                {
                  name: "Carrera S",
                  slug: "carrera-s",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "992",
                        hp: 450,
                        torque: 530,
                        zeroToHundred: 39,
                        handling: 10,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed completed: BMW, Mercedes, Audi, Porsche inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
