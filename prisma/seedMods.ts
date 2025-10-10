import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // First, let's get all the existing badges and year ranges to create compatibilities
  const badges = await prisma.badge.findMany({
    include: {
      yearRanges: true,
      model: {
        include: {
          make: true,
        },
      },
    },
  });

  // Create Mod Categories
  const intakeCategory = await prisma.modCategory.upsert({
    where: { slug: "intake" },
    update: {},
    create: {
      name: "Intake",
      slug: "intake",
      description: "Cold air intakes and intake systems",
    },
  });

  const exhaustCategory = await prisma.modCategory.upsert({
    where: { slug: "exhaust" },
    update: {},
    create: {
      name: "Exhaust",
      slug: "exhaust",
      description: "Exhaust systems, downpipes, and catbacks",
    },
  });

  const suspensionCategory = await prisma.modCategory.upsert({
    where: { slug: "suspension" },
    update: {},
    create: {
      name: "Suspension",
      slug: "suspension",
      description: "Coilovers, springs, and suspension components",
    },
  });

  const tuneCategory = await prisma.modCategory.upsert({
    where: { slug: "tune" },
    update: {},
    create: {
      name: "Tune",
      slug: "tune",
      description: "ECU tunes and performance software",
    },
  });

  const turboCategory = await prisma.modCategory.upsert({
    where: { slug: "turbo" },
    update: {},
    create: {
      name: "Turbo",
      slug: "turbo",
      description: "Turbochargers and turbo upgrades",
    },
  });

  const intercoolerCategory = await prisma.modCategory.upsert({
    where: { slug: "intercooler" },
    update: {},
    create: {
      name: "Intercooler",
      slug: "intercooler",
      description: "Front mount and upgraded intercoolers",
    },
  });

  // Create Intake Mods
  const coldAirIntake = await prisma.mod.upsert({
    where: { slug: "cold-air-intake-universal" },
    update: {},
    create: {
      name: "Performance Cold Air Intake",
      slug: "cold-air-intake-universal",
      brand: "K&N",
      category: "intake",
      description: "High-flow cold air intake system for improved airflow and sound",
      modCategoryId: intakeCategory.id,
      media: {
        create: {
          name: "performance-cold-air-intake-k&n",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/performance-cold-air-intake-k%26n.png",
        },
      },
    },
  });

  const carbonFiberIntake = await prisma.mod.upsert({
    where: { slug: "carbon-fiber-intake" },
    update: {},
    create: {
      name: "Carbon Fiber Intake System",
      slug: "carbon-fiber-intake",
      brand: "BMC",
      category: "intake",
      description: "Lightweight carbon fiber intake with performance gains",
      modCategoryId: intakeCategory.id,
      media: {
        create: {
          name: "carbon-fiber-intake-bmc",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/carbon-fiber-intake-system-bmc.png",
        },
      },
    },
  });

  // Create Exhaust Mods
  const catBackExhaust = await prisma.mod.upsert({
    where: { slug: "cat-back-exhaust" },
    update: {},
    create: {
      name: "Performance Cat-Back Exhaust",
      slug: "cat-back-exhaust",
      brand: "Borla",
      category: "exhaust",
      description: "Full cat-back exhaust system with aggressive sound",
      modCategoryId: exhaustCategory.id,
      media: {
        create: {
          name: "performance-cat-back-exhaust-borla",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/performance-cat-back-exhaust-borla.png",
        },
      },
    },
  });

  const downpipe = await prisma.mod.upsert({
    where: { slug: "high-flow-downpipe" },
    update: {},
    create: {
      name: "High-Flow Downpipe",
      slug: "high-flow-downpipe",
      brand: "COBB",
      category: "exhaust",
      description: "High-flow catted downpipe for turbo applications",
      modCategoryId: exhaustCategory.id,
      media: {
        create: {
          name: "high-flow-downpipe-cobb",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/high-flow-downpipe-cobb.png",
        },
      },
    },
  });

  const valvetronic = await prisma.mod.upsert({
    where: { slug: "valvetronic-exhaust" },
    update: {},
    create: {
      name: "Valvetronic Exhaust System",
      slug: "valvetronic-exhaust",
      brand: "Fi Exhaust",
      category: "exhaust",
      description: "Electronic valve-controlled exhaust system",
      modCategoryId: exhaustCategory.id,
      media: {
        create: {
          name: "valvetronic-exhaust-system-fiexhaust",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/valvetronic-exhaust-system-fi-exhaust.png",
        },
      },
    },
  });

  // Create Suspension Mods
  const coilovers = await prisma.mod.upsert({
    where: { slug: "performance-coilovers" },
    update: {},
    create: {
      name: "Performance Coilovers",
      slug: "performance-coilovers",
      brand: "KW",
      category: "suspension",
      description: "Adjustable height and damping coilover system",
      modCategoryId: suspensionCategory.id,
      media: {
        create: {
          name: "performance-coilovers-kw",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/performance-coilovers-kw.png",
        },
      },
    },
  });

  const sportSprings = await prisma.mod.upsert({
    where: { slug: "sport-springs" },
    update: {},
    create: {
      name: "Sport Lowering Springs",
      slug: "sport-springs",
      brand: "Eibach",
      category: "suspension",
      description: "Progressive rate lowering springs",
      modCategoryId: suspensionCategory.id,
      media: {
        create: {
          name: "sport-lowering-springs-eibach",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/sport-lowering-springs.png",
        },
      },
    },
  });

  const swaybars = await prisma.mod.upsert({
    where: { slug: "performance-sway-bars" },
    update: {},
    create: {
      name: "Performance Sway Bars",
      slug: "performance-sway-bars",
      brand: "Hotchkis",
      category: "suspension",
      description: "Front and rear sway bar set for reduced body roll",
      modCategoryId: suspensionCategory.id,
      media: {
        create: {
          name: "performance-sway-bars-hotchkis",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/performance-sway-bars.png",
        },
      },
    },
  });

  // Create Tune Mods
  const stage1Tune = await prisma.mod.upsert({
    where: { slug: "stage-1-tune" },
    update: {},
    create: {
      name: "Stage 1 ECU Tune",
      slug: "stage-1-tune",
      brand: "APR",
      category: "tune",
      description: "Stage 1 ECU tune for stock hardware",
      modCategoryId: tuneCategory.id,
      media: {
        create: {
          name: "stage-1-tune-apr",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/stage1-ecu-tune-apr.png",
        },
      },
    },
  });

  const stage2Tune = await prisma.mod.upsert({
    where: { slug: "stage-2-tune" },
    update: {},
    create: {
      name: "Stage 2 ECU Tune",
      slug: "stage-2-tune",
      brand: "APR",
      category: "tune",
      description: "Stage 2 ECU tune requiring downpipe and intake",
      modCategoryId: tuneCategory.id,
      media: {
        create: {
          name: "stage-2-tune-apr",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/stage2-ecu-tune-apr.png",
        },
      },
    },
  });

  // Create Turbo Mods
  const turboUpgrade = await prisma.mod.upsert({
    where: { slug: "turbo-upgrade" },
    update: {},
    create: {
      name: "Hybrid Turbo Upgrade",
      slug: "turbo-upgrade",
      brand: "Garrett",
      category: "turbo",
      description: "Upgraded hybrid turbocharger for increased power",
      modCategoryId: turboCategory.id,
      media: {
        create: {
          name: "hybrid-turbo-upgrade-garrett",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/hybird-turbo-upgrade-garrett.png",
        },
      },
    },
  });

  // Create Intercooler Mods
  const fmicUpgrade = await prisma.mod.upsert({
    where: { slug: "front-mount-intercooler" },
    update: {},
    create: {
      name: "Front Mount Intercooler",
      slug: "front-mount-intercooler",
      brand: "Mishimoto",
      category: "intercooler",
      description: "Large front-mount intercooler upgrade",
      modCategoryId: intercoolerCategory.id,
      media: {
        create: {
          name: "front-mount-intercooler-mishimoto",
          url: "https://revup-images-yushi-2025.s3.ap-southeast-2.amazonaws.com/mod-scketch/front-mount-intercooler-mishimoto.png",
        },
      },
    },
  });

  // Now create compatibilities for each mod with appropriate year ranges
  console.log("Creating mod compatibilities...");

  // Helper function to create compatibility with performance deltas and pricing
  async function createCompatibility(
    modId: string,
    badge: { id: string; model: { id: string; name: string; make: { id: string; name: string } } },
    yearRange: { id: string; startYear: number; endYear: number | null },
    hpGain: number | null = null,
    nmGain: number | null = null,
    handlingDelta: number | null = null,
    zeroToHundredDelta: number | null = null,
    price: number | null = null,
    notes: string | null = null
  ) {
    await prisma.modCompatibility.create({
      data: {
        modId,
        badgeId: badge.id,
        modelId: badge.model.id,
        makeId: badge.model.make.id,
        modelYearRange: `${yearRange.startYear}-${yearRange.endYear || "present"}`,
        modelYearRangeId: yearRange.id,
        hpGain,
        nmGain,
        handlingDelta,
        zeroToHundredDelta,
        price,
        notes,
      },
    });
  }

  // Helper function to calculate car-specific pricing
  function getModPrice(
    basePriceRange: [number, number],
    makeName: string,
    isHighPerformance: boolean
  ): number {
    const [minPrice, maxPrice] = basePriceRange;
    let multiplier = 1.0;

    // Brand multipliers
    if (makeName === "Porsche") multiplier = 1.5;
    else if (makeName === "Mercedes-Benz") multiplier = 1.3;
    else if (makeName === "Audi") multiplier = 1.2;
    else if (makeName === "BMW") multiplier = 1.1;

    // Performance car multiplier
    if (isHighPerformance) multiplier *= 1.2;

    const basePrice = minPrice + (maxPrice - minPrice) * Math.random();
    return Math.round(basePrice * multiplier);
  }

  // Create compatibilities for each badge and year range
  for (const badge of badges) {
    for (const yearRange of badge.yearRanges) {
      const makeName = badge.model.make.name;
      const isTurbo = [
        "330i",
        "340i",
        "M340i",
        "M240i",
        "230i",
        "C300",
        "C43 AMG",
        "A4 45 TFSI",
        "A5 45 TFSI",
        "S4",
        "Carrera",
        "Carrera S",
      ].includes(badge.name);
      const isHighPerformance = [
        "M340i",
        "M240i",
        "C43 AMG",
        "S4",
        "Carrera",
        "Carrera S",
      ].includes(badge.name);

      // Cold Air Intake - Universal compatibility
      await createCompatibility(
        coldAirIntake.id,
        badge,
        yearRange,
        isTurbo ? 8 : 5, // HP gain
        isTurbo ? 15 : 10, // Torque gain in Nm
        null,
        isTurbo ? -1 : 0, // Slight acceleration improvement for turbo cars
        getModPrice([300, 400], makeName, isHighPerformance), // Car-specific pricing
        `Compatible with ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Carbon Fiber Intake - Higher performance gains
      await createCompatibility(
        carbonFiberIntake.id,
        badge,
        yearRange,
        isTurbo ? 12 : 8,
        isTurbo ? 20 : 15,
        null,
        isTurbo ? -2 : -1,
        getModPrice([550, 750], makeName, isHighPerformance), // Premium pricing
        `Premium intake for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Cat-Back Exhaust - Universal compatibility
      await createCompatibility(
        catBackExhaust.id,
        badge,
        yearRange,
        isTurbo ? 10 : 6,
        isTurbo ? 12 : 8,
        null,
        isTurbo ? -1 : 0,
        getModPrice([1000, 1400], makeName, isHighPerformance),
        `Performance exhaust for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Downpipe - Only for turbo cars
      if (isTurbo) {
        await createCompatibility(
          downpipe.id,
          badge,
          yearRange,
          25, // Significant HP gain for turbo cars
          40, // Significant torque gain
          null,
          -3, // Noticeable acceleration improvement
          getModPrice([700, 900], makeName, isHighPerformance),
          `High-flow downpipe for turbo ${makeName} ${badge.model.name} ${badge.name}`
        );
      }

      // Valvetronic Exhaust - Premium option
      await createCompatibility(
        valvetronic.id,
        badge,
        yearRange,
        isTurbo ? 15 : 10,
        isTurbo ? 18 : 12,
        null,
        isTurbo ? -2 : -1,
        getModPrice([2200, 2800], makeName, isHighPerformance), // Premium pricing
        `Electronic valve exhaust for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Coilovers - Universal with handling improvement
      await createCompatibility(
        coilovers.id,
        badge,
        yearRange,
        null,
        null,
        isHighPerformance ? 1 : 2, // More handling improvement for non-M cars
        null,
        getModPrice([1800, 2600], makeName, isHighPerformance),
        `Adjustable coilovers for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Sport Springs - Universal with smaller handling improvement
      await createCompatibility(
        sportSprings.id,
        badge,
        yearRange,
        null,
        null,
        1, // Modest handling improvement
        null,
        getModPrice([350, 550], makeName, isHighPerformance),
        `Lowering springs for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Sway Bars - Universal handling improvement
      await createCompatibility(
        swaybars.id,
        badge,
        yearRange,
        null,
        null,
        1, // Handling improvement
        null,
        getModPrice([500, 800], makeName, isHighPerformance),
        `Performance sway bars for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Stage 1 Tune - Universal for all cars
      await createCompatibility(
        stage1Tune.id,
        badge,
        yearRange,
        isTurbo ? 30 : 15, // Bigger gains for turbo cars
        isTurbo ? 50 : 25,
        null,
        isTurbo ? -4 : -2,
        getModPrice([500, 700], makeName, isHighPerformance),
        `Stage 1 tune for ${makeName} ${badge.model.name} ${badge.name}`
      );

      // Stage 2 Tune - Only for turbo cars (requires downpipe)
      if (isTurbo) {
        await createCompatibility(
          stage2Tune.id,
          badge,
          yearRange,
          45, // Significant HP gain
          70, // Significant torque gain
          null,
          -6, // Major acceleration improvement
          getModPrice([700, 900], makeName, isHighPerformance),
          `Stage 2 tune for ${makeName} ${badge.model.name} ${badge.name} - requires downpipe and intake`
        );
      }

      // Turbo Upgrade - Only for turbo cars
      if (isTurbo) {
        await createCompatibility(
          turboUpgrade.id,
          badge,
          yearRange,
          80, // Major HP gain
          120, // Major torque gain
          null,
          -10, // Significant acceleration improvement
          getModPrice([3000, 4000], makeName, isHighPerformance), // Premium pricing for turbo upgrades
          `Hybrid turbo upgrade for ${makeName} ${badge.model.name} ${badge.name}`
        );
      }

      // Front Mount Intercooler - Only for turbo cars
      if (isTurbo) {
        await createCompatibility(
          fmicUpgrade.id,
          badge,
          yearRange,
          15, // Moderate HP gain from better cooling
          20, // Moderate torque gain
          null,
          -2,
          getModPrice([1000, 1400], makeName, isHighPerformance),
          `FMIC upgrade for ${makeName} ${badge.model.name} ${badge.name}`
        );
      }
    }
  }

  // Create mod requirements/dependencies
  console.log("Creating mod dependencies...");

  // Stage 2 tune requires BOTH exhaust AND intake categories (for turbo cars)
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: exhaustCategory.id,
      dependentId: stage2Tune.id,
    },
  });

  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: intakeCategory.id,
      dependentId: stage2Tune.id,
    },
  });

  // Turbo upgrade requires tune category first
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: tuneCategory.id,
      dependentId: turboUpgrade.id,
    },
  });

  // Turbo upgrade also requires intercooler category for cooling
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: intercoolerCategory.id,
      dependentId: turboUpgrade.id,
    },
  });

  // Turbo upgrade requires exhaust category for flow
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: exhaustCategory.id,
      dependentId: turboUpgrade.id,
    },
  });

  // Turbo upgrade requires intake category for airflow
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: intakeCategory.id,
      dependentId: turboUpgrade.id,
    },
  });

  // Performance coilovers work better with suspension category (sway bars)
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: suspensionCategory.id,
      dependentId: coilovers.id,
    },
  });

  // FMIC upgrade is recommended with tune category
  await prisma.modRequirement.create({
    data: {
      prerequisiteCategoryId: tuneCategory.id,
      dependentId: fmicUpgrade.id,
    },
  });

  console.log("Mod seed completed successfully!");
  console.log("- Created mod categories");
  console.log(`- Created mods with compatibilities for ${badges.length} badges`);
  console.log("- Created mod dependencies");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
