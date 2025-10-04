import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Helper function to create MediaAsset data for a ModelYearRange
function createMediaAssetData(
  makeName: string,
  modelName: string,
  badgeName: string,
  startYear: number,
  endYear: number | null,
  url: string = ""
) {
  const yearRangeStr = endYear ? `${startYear}-${endYear}` : `${startYear}-Present`;
  const mediaAssetName = `${makeName} -> ${modelName} -> ${badgeName} -> ${yearRangeStr}`;
  const altText = `${makeName} ${modelName} ${badgeName} ${yearRangeStr}`;

  return {
    name: mediaAssetName,
    url: url,
    alt: altText,
  };
}

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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "3 Series",
                            "320i",
                            2013,
                            2018,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-3series-2013-2018.png"
                          ),
                        },
                      },
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "G20",
                        hp: 184,
                        torque: 300,
                        zeroToHundred: 74, // 7.4s
                        handling: 7,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "3 Series",
                            "320i",
                            2019,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-3series-2019-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "3 Series",
                            "330i",
                            2013,
                            2018,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-3series-2013-2018.png"
                          ),
                        },
                      },
                      {
                        startYear: 2019,
                        endYear: null,
                        chassis: "G20",
                        hp: 258,
                        torque: 400,
                        zeroToHundred: 59, // 5.9s
                        handling: 8,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "3 Series",
                            "330i",
                            2019,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-3series-2019-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "3 Series",
                            "M340i",
                            2019,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-m340i-2019-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "2 Series",
                            "220i",
                            2014,
                            2021,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-2series-2014-2021.png"
                          ),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 184,
                        torque: 300,
                        zeroToHundred: 72, // 7.2s
                        handling: 7,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "2 Series",
                            "220i",
                            2021,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-2series-2021-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "2 Series",
                            "230i",
                            2016,
                            2021,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-2series-2016-2021.png"
                          ),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 245,
                        torque: 400,
                        zeroToHundred: 58,
                        handling: 8,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "2 Series",
                            "230i",
                            2021,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-2series-2021-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData("BMW", "2 Series", "M240i", 2016, 2021, ""),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "G42",
                        hp: 374,
                        torque: 500,
                        zeroToHundred: 44,
                        handling: 9,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "BMW",
                            "2 Series",
                            "M240i",
                            2021,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/bmw-2series-2021-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Coupe",
                            "C200",
                            2014,
                            2021,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/mercedes-c300-coupe-2016-2023.png"
                          ),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 204,
                        torque: 300,
                        zeroToHundred: 75,
                        handling: 7,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Class",
                            "C200",
                            2021,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/Mercedes-c-2021-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Coupe",
                            "C300",
                            2015,
                            2021,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/mercedes-c300-coupe-2016-2023.png"
                          ),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 258,
                        torque: 400,
                        zeroToHundred: 60,
                        handling: 8,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Class",
                            "C300",
                            2021,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/Mercedes-c-2021-present.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Class",
                            "C43 AMG",
                            2016,
                            2021,
                            ""
                          ),
                        },
                      },
                      {
                        startYear: 2021,
                        endYear: null,
                        chassis: "W206",
                        hp: 390,
                        torque: 520,
                        zeroToHundred: 47,
                        handling: 9,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "C-Class",
                            "C43 AMG",
                            2021,
                            null,
                            ""
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "A-Class",
                            "A180",
                            2018,
                            null,
                            ""
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "A-Class",
                            "A200",
                            2018,
                            null,
                            ""
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Mercedes-Benz",
                            "A-Class",
                            "A250",
                            2018,
                            null,
                            ""
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData("Audi", "A4", "A4 40 TFSI", 2016, null, ""),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData("Audi", "A4", "A4 45 TFSI", 2019, null, ""),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData("Audi", "A4", "S4", 2016, null, ""),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Audi",
                            "A5",
                            "A5 40 TFSI",
                            2017,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/audi-a5-40-2017-2024.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Audi",
                            "A5",
                            "A5 45 TFSI",
                            2017,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/audi-a5-45-2017-2024.png"
                          ),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData("Porsche", "911", "Carrera", 2019, null, ""),
                        },
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
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Porsche",
                            "911",
                            "Carrera S",
                            2019,
                            null,
                            ""
                          ),
                        },
                      },
                    ],
                  },
                },
                {
                  name: "GT3 RS",
                  slug: "gt3-rs",
                  yearRanges: {
                    create: [
                      {
                        startYear: 2022,
                        endYear: null,
                        chassis: "992",
                        hp: 518,
                        torque: 464, // 342 lb-ft = 464 Nm
                        zeroToHundred: 30, // 3.0s = 30 tenths
                        handling: 10,
                        mediaAsset: {
                          create: createMediaAssetData(
                            "Porsche",
                            "911",
                            "GT3 RS",
                            2022,
                            null,
                            "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/car-sketch/porsche-gt3-rs-2021.png"
                          ),
                        },
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

  console.log("Seed completed: BMW, Mercedes, Audi, Porsche inserted with MediaAssets.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
