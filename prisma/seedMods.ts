import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ---------------------------
 * Helpers
 * --------------------------- */
async function ensureCategory(name: string, slug: string) {
  const c = await prisma.modCategory.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
  return c.id;
}

async function ensureMod({
  name,
  slug,
  brand,
  category,
  modCategoryId,
  description,
  price,
}: {
  name: string;
  slug: string;
  brand: string;
  category: string;
  modCategoryId: string;
  description?: string;
  price?: number | null;
}) {
  const mod = await prisma.mod.upsert({
    where: { slug },
    update: {
      name,
      brand,
      category,
      description,
      price: price ?? null,
      modCategoryId,
    },
    create: {
      name,
      slug,
      brand,
      category,
      description,
      price: price ?? null,
      modCategoryId,
    },
  });
  return mod.id;
}

// Find a badge by make slug + model slug + badge name
async function findBadge(makeSlug: string, modelSlug: string, badgeName: string) {
  const badge = await prisma.badge.findFirst({
    where: {
      name: badgeName,
      model: { slug: modelSlug, make: { slug: makeSlug } },
    },
    include: { model: { include: { make: true } } },
  });
  if (!badge) throw new Error(`Badge not found: ${makeSlug}/${modelSlug}/${badgeName}`);
  return badge;
}

// Create a ModCompatibility row given a badge and deltas
async function compat(modId: string, badge: { id: string; model: { id: string; make: { id: string } } }, opts: {
  yearStart?: number | null;
  yearEnd?: number | null;
  hpGain?: number | null;
  nmGain?: number | null;
  handlingDelta?: number | null;
  zeroToHundredDelta?: number | null; // tenths; negative = faster
  notes?: string | null;
}) {
  await prisma.modCompatibility.create({
    data: {
      modId,
      badgeId: badge.id,
      modelId: badge.model.id,
      makeId: badge.model.make.id,
      yearStart: opts.yearStart ?? null,
      yearEnd: opts.yearEnd ?? null,
      hpGain: opts.hpGain ?? null,
      nmGain: opts.nmGain ?? null,
      handlingDelta: opts.handlingDelta ?? null,
      zeroToHundredDelta: opts.zeroToHundredDelta ?? null,
      notes: opts.notes ?? null,
    },
  });
}

// Dependency link: Stage 2 depends on Downpipe+IC; some cars also need TCU recommended etc.
async function requireMod(dependentId: string, prerequisiteId: string) {
  // Using composite-ish id to avoid dupes; your schema uses cuid for PK.
  await prisma.modRequirement.upsert({
    where: { id: `${dependentId.slice(0,8)}_${prerequisiteId.slice(0,8)}` },
    update: {},
    create: {
      id: `${dependentId.slice(0,8)}_${prerequisiteId.slice(0,8)}`,
      dependentId,
      prerequisiteId,
    },
  });
}

/* ---------------------------
 * Seed
 * --------------------------- */
async function main() {
  // Categories as “slots”
  const catECU         = await ensureCategory("ECU Tune", "ecu-tune");
  const catTCU         = await ensureCategory("TCU Tune", "tcu-tune");
  const catDownpipe    = await ensureCategory("Downpipe", "downpipe");
  const catIntercooler = await ensureCategory("Intercooler", "intercooler");
  const catIntake      = await ensureCategory("Intake", "intake");
  const catTurboInlet  = await ensureCategory("Turbo Inlet", "turbo-inlet");
  const catCatback     = await ensureCategory("Cat-Back Exhaust", "catback");
  const catSuspension  = await ensureCategory("Suspension", "suspension");
  const catBrakes      = await ensureCategory("Brakes", "brakes");
  const catTyres       = await ensureCategory("Tyres", "tyres");

  /* ---------------- BMW Mods ---------------- */
  const bm3Stage1B48 = await ensureMod({
    name: "BM3 Stage 1 (B48)", slug: "bm3-stage1-b48", brand: "bootmod3",
    category: "ecu", modCategoryId: catECU, description: "OTS Stage 1 for BMW B48"
  });
  const bm3Stage2B48 = await ensureMod({
    name: "BM3 Stage 2 (B48)", slug: "bm3-stage2-b48", brand: "bootmod3",
    category: "ecu", modCategoryId: catECU, description: "Requires downpipe + intercooler"
  });
  const bm3Stage1B58 = await ensureMod({
    name: "BM3 Stage 1 (B58)", slug: "bm3-stage1-b58", brand: "bootmod3",
    category: "ecu", modCategoryId: catECU
  });
  const bm3Stage2B58 = await ensureMod({
    name: "BM3 Stage 2 (B58)", slug: "bm3-stage2-b58", brand: "bootmod3",
    category: "ecu", modCategoryId: catECU, description: "Requires downpipe + intercooler; HPFP recommended on Gen1"
  });
  const xhpZF8 = await ensureMod({
    name: "xHP ZF8 TCU Tune", slug: "xhp-zf8", brand: "xHP",
    category: "tcu", modCategoryId: catTCU
  });
  const bmwDownpipe = await ensureMod({
    name: "High-Flow Downpipe", slug: "bmw-downpipe", brand: "Various",
    category: "downpipe", modCategoryId: catDownpipe
  });
  const bmwIC = await ensureMod({
    name: "Upgraded Intercooler", slug: "bmw-fmic", brand: "Wagner/CSF",
    category: "intercooler", modCategoryId: catIntercooler
  });
  const bmwIntake = await ensureMod({
    name: "Performance Intake", slug: "bmw-intake", brand: "Eventuri/BMS",
    category: "intake", modCategoryId: catIntake
  });

  /* ---------------- Mercedes Mods ---------------- */
  const c43Stage1 = await ensureMod({
    name: "Stage 1 ECU (C43 M276)", slug: "c43-stage1", brand: "OE Tuning",
    category: "ecu", modCategoryId: catECU
  });
  const c43Stage2 = await ensureMod({
    name: "Stage 2 ECU (C43 M276)", slug: "c43-stage2", brand: "OE Tuning",
    category: "ecu", modCategoryId: catECU, description: "Requires downpipes"
  });
  const mbDownpipes = await ensureMod({
    name: "High-Flow Downpipes (Mercedes)", slug: "mb-downpipes", brand: "Milltek/ARM",
    category: "downpipe", modCategoryId: catDownpipe
  });
  const m274Stage1 = await ensureMod({
    name: "Stage 1 ECU (C200/C300 M274)", slug: "m274-stage1", brand: "Weistec/AMR",
    category: "ecu", modCategoryId: catECU
  });
  const m274Stage2 = await ensureMod({
    name: "Stage 2 ECU (C300 M274)", slug: "m274-stage2", brand: "Weistec/AMR",
    category: "ecu", modCategoryId: catECU, description: "Requires downpipe + intercooler"
  });
  const a250Stage1 = await ensureMod({
    name: "Stage 1 ECU (A250 M260)", slug: "a250-stage1", brand: "Celtic",
    category: "ecu", modCategoryId: catECU
  });
  const a200Stage1 = await ensureMod({
    name: "Stage 1 ECU (A200 M282 1.3T)", slug: "a200-stage1", brand: "Various",
    category: "ecu", modCategoryId: catECU
  });
  const aIntake13T = await ensureMod({
    name: "Intake Kit (A180/A200 1.3T)", slug: "a-class-13t-intake", brand: "MST",
    category: "intake", modCategoryId: catIntake
  });

  /* ---------------- Audi Mods ---------------- */
  const aprEA888Stg1 = await ensureMod({
    name: "APR Stage 1 ECU (EA888 2.0T B9/B9.5)", slug: "apr-ea888-stage1", brand: "APR",
    category: "ecu", modCategoryId: catECU
  });
  const turboInletEA888 = await ensureMod({
    name: "Turbo Inlet (EA888 Gen3)", slug: "ea888-turbo-inlet", brand: "IE/034",
    category: "turbo-inlet", modCategoryId: catTurboInlet
  });
  const aprEA839Stg1 = await ensureMod({
    name: "APR Stage 1 ECU (EA839 3.0T)", slug: "apr-ea839-stage1", brand: "APR",
    category: "ecu", modCategoryId: catECU
  });

  /* ---------------- Porsche Mods ---------------- */
  const mEng992Stg1 = await ensureMod({
    name: "M-Engineering Stage 1 (992)", slug: "m-engineering-992-stage1", brand: "M-Engineering",
    category: "ecu", modCategoryId: catECU
  });
  const p992Catback = await ensureMod({
    name: "Cat-Back Exhaust (992)", slug: "porsche-992-catback", brand: "Akrapovic/SOUL",
    category: "catback", modCategoryId: catCatback
  });

  /* ---------------- Universal Chassis Mods ---------------- */
  const springs = await ensureMod({
    name: "Lowering Springs", slug: "lowering-springs", brand: "Eibach/H&R",
    category: "suspension", modCategoryId: catSuspension
  });
  const coilovers = await ensureMod({
    name: "Coilovers", slug: "coilovers", brand: "KW/BC",
    category: "suspension", modCategoryId: catSuspension
  });
  const bbk = await ensureMod({
    name: "Big Brake Kit", slug: "bbk", brand: "Brembo/Alcon",
    category: "brakes", modCategoryId: catBrakes
  });
  const ps4s = await ensureMod({
    name: "Michelin Pilot Sport 4S", slug: "tyre-ps4s", brand: "Michelin",
    category: "tyres", modCategoryId: catTyres
  });
  const re71rs = await ensureMod({
    name: "Bridgestone RE-71RS", slug: "tyre-re71rs", brand: "Bridgestone",
    category: "tyres", modCategoryId: catTyres
  });

  /* ---------------- Dependencies ---------------- */
  await requireMod(bm3Stage2B48, bmwDownpipe);
  await requireMod(bm3Stage2B48, bmwIC);
  await requireMod(bm3Stage2B58, bmwDownpipe);
  await requireMod(bm3Stage2B58, bmwIC);
  await requireMod(c43Stage2, mbDownpipes);
  await requireMod(m274Stage2, mbDownpipes);

  /* ---------------- Resolve Badges ----------------
    Must match your car seed:
    BMW: 3 Series (320i F30 2013–2018, 330i F30 2016–2018, 330i G20 2019–, M340i G20 2019–)
        2 Series (220i F22 2014–2021, 230i F22 2016–2021, M240i F22 2016–2021,
                  230i G42 2021–, M240i G42 2021–)
    Mercedes: C200 W205 2014–2021, C200 W206 2021–,
              C300 W205 2015–2021, C300 W206 2021–,
              C43 AMG W205 2016–2021, C43 AMG W206 2021–,
              A180 W177 2018–, A200 W177 2018–, A250 W177 2018–
    Audi: A4 40 TFSI B9 2016–, A4 45 TFSI B9.5 2019–, S4 B9 2016–,
          A5 40 TFSI 2017–, A5 45 TFSI 2019–
    Porsche: 911 Carrera 992 2019–, Carrera S 992 2019–
  -------------------------------------------------- */

  // BMW
  const bmw320i = await findBadge("bmw", "3-series", "320i");
  const bmw330i = await findBadge("bmw", "3-series", "330i");
  const bmwM340i = await findBadge("bmw", "3-series", "M340i");
  const bmw220i = await findBadge("bmw", "2-series", "220i");
  const bmw230i = await findBadge("bmw", "2-series", "230i");
  const bmwM240i = await findBadge("bmw", "2-series", "M240i");

  // Mercedes
  const mbC200 = await findBadge("mercedes", "c-class", "C200");
  const mbC300 = await findBadge("mercedes", "c-class", "C300");
  const mbC43  = await findBadge("mercedes", "c-class", "C43 AMG");
  const mbA180 = await findBadge("mercedes", "a-class", "A180");
  const mbA200 = await findBadge("mercedes", "a-class", "A200");
  const mbA250 = await findBadge("mercedes", "a-class", "A250");

  // Audi
  const audiA4_40 = await findBadge("audi", "a4", "A4 40 TFSI");
  const audiA4_45 = await findBadge("audi", "a4", "A4 45 TFSI");
  const audiS4    = await findBadge("audi", "a4", "S4");
  const audiA5_40 = await findBadge("audi", "a5", "A5 40 TFSI");
  const audiA5_45 = await findBadge("audi", "a5", "A5 45 TFSI");

  // Porsche
  const p911Carrera  = await findBadge("porsche", "911", "Carrera");
  const p911CarreraS = await findBadge("porsche", "911", "Carrera S");

  /* ---------------- COMPAT PER YEAR RANGE ----------------
    Conventions:
    - zeroToHundredDelta in tenths. Negative = faster.
    - Gains are conservative and typical for OTS maps and bolt-ons.
  --------------------------------------------------------- */

  // ===== BMW 3 Series =====
  // 320i F30 2013–2018
  await compat(bm3Stage1B48, bmw320i, { yearStart: 2013, yearEnd: 2018, hpGain: 45, nmGain: 80, zeroToHundredDelta: -6, notes: "B48 Stage 1" });
  await compat(bm3Stage2B48, bmw320i, { yearStart: 2013, yearEnd: 2018, hpGain: 70, nmGain: 110, zeroToHundredDelta: -9 });
  await compat(bmwDownpipe,   bmw320i, { yearStart: 2013, yearEnd: 2018, hpGain: 18, nmGain: 30 });
  await compat(bmwIC,         bmw320i, { yearStart: 2013, yearEnd: 2018, hpGain: 10, nmGain: 15 });
  await compat(bmwIntake,     bmw320i, { yearStart: 2013, yearEnd: 2018, hpGain: 7,  nmGain: 10 });

  // 320i G20 2019–present
  await compat(bm3Stage1B48, bmw320i, { yearStart: 2019, yearEnd: null, hpGain: 45, nmGain: 80,  zeroToHundredDelta: -5 });
  await compat(bm3Stage2B48, bmw320i, { yearStart: 2019, yearEnd: null, hpGain: 70, nmGain: 110, zeroToHundredDelta: -8 });
  await compat(bmwDownpipe,  bmw320i, { yearStart: 2019, yearEnd: null, hpGain: 18, nmGain: 30 });
  await compat(bmwIC,        bmw320i, { yearStart: 2019, yearEnd: null, hpGain: 10, nmGain: 15 });
  await compat(bmwIntake,    bmw320i, { yearStart: 2019, yearEnd: null, hpGain: 7,  nmGain: 10 });

  // 330i F30 2016–2018
  await compat(bm3Stage1B48, bmw330i, { yearStart: 2016, yearEnd: 2018, hpGain: 50, nmGain: 90, zeroToHundredDelta: -6 });
  await compat(bm3Stage2B48, bmw330i, { yearStart: 2016, yearEnd: 2018, hpGain: 75, nmGain: 120, zeroToHundredDelta: -9 });
  await compat(bmwDownpipe,  bmw330i, { yearStart: 2016, yearEnd: 2018, hpGain: 20, nmGain: 35 });
  await compat(bmwIntake,    bmw330i, { yearStart: 2016, yearEnd: 2018, hpGain: 7,  nmGain: 10 });

  // 330i G20 2019–present
  await compat(bm3Stage1B48, bmw330i, { yearStart: 2019, yearEnd: null, hpGain: 45, nmGain: 80, zeroToHundredDelta: -5 });
  await compat(bm3Stage2B48, bmw330i, { yearStart: 2019, yearEnd: null, hpGain: 70, nmGain: 110, zeroToHundredDelta: -8 });
  await compat(bmwDownpipe,  bmw330i, { yearStart: 2019, yearEnd: null, hpGain: 18, nmGain: 30 });
  await compat(bmwIC,        bmw330i, { yearStart: 2019, yearEnd: null, hpGain: 10, nmGain: 15 });
  await compat(bmwIntake,    bmw330i, { yearStart: 2019, yearEnd: null, hpGain: 7,  nmGain: 10 });

  // M340i G20 2019–present (B58)
  await compat(bm3Stage1B58, bmwM340i, { yearStart: 2019, yearEnd: null, hpGain: 70, nmGain: 100, zeroToHundredDelta: -4, notes: "OTS on 98 RON" });
  await compat(bm3Stage2B58, bmwM340i, { yearStart: 2019, yearEnd: null, hpGain: 110, nmGain: 160, zeroToHundredDelta: -7 });
  await compat(bmwDownpipe,  bmwM340i, { yearStart: 2019, yearEnd: null, hpGain: 25, nmGain: 40 });
  await compat(xhpZF8,       bmwM340i, { yearStart: 2019, yearEnd: null, zeroToHundredDelta: -2, notes: "Faster shifts, higher torque limits" });

  // ===== BMW 2 Series =====
  // 220i F22 2014–2021
  await compat(bm3Stage1B48, bmw220i, { yearStart: 2014, yearEnd: 2021, hpGain: 45, nmGain: 80, zeroToHundredDelta: -5 });
  await compat(bmwIntake,    bmw220i, { yearStart: 2014, yearEnd: 2021, hpGain: 6,  nmGain: 8 });

  // 230i F22 2016–2021
  await compat(bm3Stage1B48, bmw230i, { yearStart: 2016, yearEnd: 2021, hpGain: 50, nmGain: 90, zeroToHundredDelta: -5 });

  // M240i F22 2016–2021
  await compat(bm3Stage1B58, bmwM240i, { yearStart: 2016, yearEnd: 2021, hpGain: 65, nmGain: 95, zeroToHundredDelta: -4 });

  // 230i G42 2021–present
  await compat(bm3Stage1B48, bmw230i, { yearStart: 2021, yearEnd: null, hpGain: 45, nmGain: 80, zeroToHundredDelta: -5 });

  // M240i G42 2021–present
  await compat(bm3Stage1B58, bmwM240i, { yearStart: 2021, yearEnd: null, hpGain: 70, nmGain: 100, zeroToHundredDelta: -4 });

  // Chassis/tyres for popular BMW trims
  for (const badge of [bmw330i, bmwM340i, bmw230i, bmwM240i]) {
    await compat(springs, badge, { handlingDelta: 1 });
    await compat(coilovers, badge, { handlingDelta: 2 });
    await compat(ps4s, badge, { zeroToHundredDelta: -1, notes: "Better traction" });
    await compat(re71rs, badge, { handlingDelta: 1, zeroToHundredDelta: -1, notes: "200TW track-focused" });
    await compat(bbk, badge, { notes: "Improved fade resistance" });
  }

  // ===== Mercedes C-Class =====
  // C200 W205 2014–2021
  await compat(m274Stage1, mbC200, { yearStart: 2014, yearEnd: 2021, hpGain: 25, nmGain: 45, zeroToHundredDelta: -2 });

  // C200 W206 2021–present
  await compat(m274Stage1, mbC200, { yearStart: 2021, yearEnd: null, hpGain: 25, nmGain: 45, zeroToHundredDelta: -2 });

  // C300 W205 2015–2021
  await compat(m274Stage1, mbC300, { yearStart: 2015, yearEnd: 2021, hpGain: 35, nmGain: 50, zeroToHundredDelta: -3 });
  await compat(m274Stage2, mbC300, { yearStart: 2015, yearEnd: 2021, hpGain: 60, nmGain: 90, zeroToHundredDelta: -5 });
  await compat(mbDownpipes, mbC300, { yearStart: 2015, yearEnd: 2021, hpGain: 15, nmGain: 25 });

  // C300 W206 2021–present
  await compat(m274Stage1, mbC300, { yearStart: 2021, yearEnd: null, hpGain: 35, nmGain: 50, zeroToHundredDelta: -3 });

  // C43 AMG W205 2016–2021
  await compat(c43Stage1, mbC43, { yearStart: 2016, yearEnd: 2021, hpGain: 70, nmGain: 140, zeroToHundredDelta: -4 });
  await compat(c43Stage2, mbC43, { yearStart: 2016, yearEnd: 2021, hpGain: 95, nmGain: 170, zeroToHundredDelta: -6 });
  await compat(mbDownpipes, mbC43, { yearStart: 2016, yearEnd: 2021, hpGain: 25, nmGain: 40 });

  // C43 AMG W206 2021–present
  await compat(c43Stage1, mbC43, { yearStart: 2021, yearEnd: null, hpGain: 60, nmGain: 120, zeroToHundredDelta: -3, notes: "M139L 2.0T hybrid; conservative numbers" });

  // ===== Mercedes A-Class W177 =====
  await compat(a250Stage1, mbA250, { yearStart: 2018, yearEnd: null, hpGain: 30, nmGain: 50, zeroToHundredDelta: -3 });
  await compat(a200Stage1, mbA200, { yearStart: 2018, yearEnd: null, hpGain: 25, nmGain: 45, zeroToHundredDelta: -2 });
  await compat(aIntake13T, mbA180, { yearStart: 2018, yearEnd: null, hpGain: 8,  nmGain: 12 });

  for (const badge of [mbC300, mbC43, mbA250, mbA200]) {
    await compat(ps4s, badge, { zeroToHundredDelta: -1 });
    await compat(springs, badge, { handlingDelta: 1 });
    await compat(coilovers, badge, { handlingDelta: 2 });
  }

  // ===== Audi =====
  // A4 40 TFSI B9 2016–present
  await compat(aprEA888Stg1,   audiA4_40, { yearStart: 2016, yearEnd: null, hpGain: 65, nmGain: 140, zeroToHundredDelta: -6 });
  await compat(turboInletEA888, audiA4_40, { yearStart: 2016, yearEnd: null, hpGain: 10, nmGain: 15 });

  // A4 45 TFSI B9.5 2019–present
  await compat(aprEA888Stg1,   audiA4_45, { yearStart: 2019, yearEnd: null, hpGain: 60, nmGain: 120, zeroToHundredDelta: -5 });
  await compat(turboInletEA888, audiA4_45, { yearStart: 2019, yearEnd: null, hpGain: 10, nmGain: 15 });

  // S4 B9 2016–present (EA839 3.0T)
  await compat(aprEA839Stg1, audiS4, { yearStart: 2016, yearEnd: null, hpGain: 95, nmGain: 155, zeroToHundredDelta: -5 });

  // A5 40 TFSI 2017–present
  await compat(aprEA888Stg1,   audiA5_40, { yearStart: 2017, yearEnd: null, hpGain: 65, nmGain: 140, zeroToHundredDelta: -6 });
  await compat(turboInletEA888, audiA5_40, { yearStart: 2017, yearEnd: null, hpGain: 10, nmGain: 15 });

  // A5 45 TFSI 2019–present
  await compat(aprEA888Stg1,   audiA5_45, { yearStart: 2019, yearEnd: null, hpGain: 60, nmGain: 120, zeroToHundredDelta: -5 });
  await compat(turboInletEA888, audiA5_45, { yearStart: 2019, yearEnd: null, hpGain: 10, nmGain: 15 });

  for (const badge of [audiA4_45, audiS4, audiA5_45]) {
    await compat(ps4s, badge, { zeroToHundredDelta: -1 });
    await compat(coilovers, badge, { handlingDelta: 2 });
    await compat(bbk, badge, { notes: "Larger rotors + multi-piston calipers" });
  }

  // ===== Porsche 992 =====
  await compat(mEng992Stg1, p911Carrera,  { yearStart: 2019, yearEnd: null, hpGain: 95,  nmGain: 140, zeroToHundredDelta: -3 });
  await compat(mEng992Stg1, p911CarreraS, { yearStart: 2019, yearEnd: null, hpGain: 150, nmGain: 180, zeroToHundredDelta: -4 });
  await compat(p992Catback, p911Carrera,  { yearStart: 2019, yearEnd: null, hpGain: 10,  nmGain: 12 });
  await compat(p992Catback, p911CarreraS, { yearStart: 2019, yearEnd: null, hpGain: 10,  nmGain: 12 });

  console.log("✅ Mods + per-yearRange compatibility seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
