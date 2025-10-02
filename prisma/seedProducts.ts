import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting product seed...");

  const modCompatibilities = await prisma.modCompatibility.findMany({
    include: {
      mod: true,
      modelYearRangeObj: {
        include: {
          badge: {
            include: {
              model: {
                include: {
                  make: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const modCompatibility of modCompatibilities) {
    await prisma.product.create({
      data: {
        name: `${modCompatibility.mod.name} ${modCompatibility.modelYearRangeObj.badge.model.make.name} ${modCompatibility.modelYearRangeObj.badge.model.name} ${modCompatibility.modelYearRangeObj.badge.name} ${modCompatibility.modelYearRange}`,
        description: modCompatibility.mod.description,
        priceCents: modCompatibility.price ? modCompatibility.price * 100 : 0,
        modId: modCompatibility.modId,
        compatibilityId: modCompatibility.id,
      },
    });
  }

  console.log("🌱 Product seed completed!");
}

main();
