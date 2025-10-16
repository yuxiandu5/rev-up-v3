// prisma/seed.ts
import { execSync } from "child_process";

async function main() {
  try {
    console.log("🌱 Running user seed...");
    execSync("npx tsx prisma/seedUsers.ts", { stdio: "inherit" });

    console.log("🌱 Running car seed...");
    execSync("npx tsx prisma/seedCars.ts", { stdio: "inherit" });

    console.log("🌱 Running mod seed...");
    execSync("npx tsx prisma/seedMods.ts", { stdio: "inherit" });

    console.log("🌱 Running product seed...");
    execSync("npx tsx prisma/seedProducts.ts", { stdio: "inherit" });

    console.log("🌱 Running order seed...");
    execSync("npx tsx prisma/seedOrders.ts", { stdio: "inherit" });

    console.log("✅ All seeds completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
