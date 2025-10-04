import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { testPrisma as prisma } from "../utils/test-prisma";
import { GET as marketplaceGET } from "../../src/app/api/market-place/route";
import { NextRequest } from "next/server";
import {
  Badge,
  Make,
  Mod,
  ModCategory,
  ModCompatibility,
  Model,
  ModelYearRange,
  Product,
} from "@prisma/client";

describe("Marketplace Integration Tests", () => {
  let testMake: Make;
  let testModel: Model;
  let testBadge: Badge;
  let testYearRange: ModelYearRange;
  let testModCategory: ModCategory;
  let testMod: Mod;
  let testCompatibility: ModCompatibility;
  let testProduct: Product;

  beforeEach(async () => {
    // Create test data hierarchy
    testMake = await prisma.make.create({
      data: {
        name: "BMW",
        slug: "bmw",
      },
    });

    testModel = await prisma.model.create({
      data: {
        name: "3 Series",
        slug: "3-series",
        makeId: testMake.id,
      },
    });

    testBadge = await prisma.badge.create({
      data: {
        name: "320i",
        slug: "320i",
        modelId: testModel.id,
      },
    });

    testYearRange = await prisma.modelYearRange.create({
      data: {
        badgeId: testBadge.id,
        startYear: 2015,
        endYear: 2020,
        chassis: "F30",
        hp: 184,
        torque: 270,
        zeroToHundred: 75,
        handling: 80,
      },
    });

    testModCategory = await prisma.modCategory.create({
      data: {
        name: "ECU Tune",
        slug: "ecu-tune",
        description: "Engine control unit modifications",
      },
    });

    testMod = await prisma.mod.create({
      data: {
        name: "Stage 1 ECU Tune",
        slug: "stage-1-ecu-tune",
        brand: "APR",
        category: "tune",
        description: "Stage 1 ECU tune for stock hardware",
        modCategoryId: testModCategory.id,
      },
    });

    testCompatibility = await prisma.modCompatibility.create({
      data: {
        modId: testMod.id,
        modelYearRangeId: testYearRange.id,
        badgeId: testBadge.id,
        modelId: testModel.id,
        makeId: testMake.id,
        modelYearRange: "2015-2020",
        hpGain: 30,
        nmGain: 50,
        handlingDelta: 5,
        zeroToHundredDelta: -8,
        price: 584,
        notes: "Requires 95+ octane fuel",
      },
    });

    testProduct = await prisma.product.create({
      data: {
        name: "Stage 1 ECU Tune BMW 3 Series 320i 2015-2020",
        description: "Stage 1 ECU tune for stock hardware",
        priceCents: 58400,
        currency: "AUD",
        stock: 10,
        isActive: true,
        modId: testMod.id,
        compatibilityId: testCompatibility.id,
      },
    });
  });

  afterEach(async () => {
    await prisma.product.deleteMany({});
    await prisma.modCompatibility.deleteMany({});
    await prisma.mod.deleteMany({});
    await prisma.modCategory.deleteMany({});
    await prisma.modelYearRange.deleteMany({});
    await prisma.badge.deleteMany({});
    await prisma.model.deleteMany({});
    await prisma.make.deleteMany({});
  });

  describe("GET /api/market-place", () => {
    it("should return products with default pagination", async () => {
      const request = new NextRequest("http://localhost:3000/api/market-place");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe("Stage 1 ECU Tune BMW 3 Series 320i 2015-2020");
      expect(data.data[0].price.amountCents).toBe(58400);
      expect(data.meta.total).toBe(1);
      expect(data.meta.page).toBe(1);
      expect(data.meta.pageSize).toBe(50);
    });

    it("should filter products by search term", async () => {
      // Create another product that shouldn't match
      await prisma.product.create({
        data: {
          name: "Cold Air Intake",
          description: "Performance cold air intake",
          priceCents: 35000,
          currency: "AUD",
          isActive: true,
          modId: testMod.id,
        },
      });

      const request = new NextRequest("http://localhost:3000/api/market-place?search=ECU");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toContain("ECU");
    });

    it("should handle pagination correctly", async () => {
      // Create more products for pagination test
      for (let i = 0; i < 15; i++) {
        await prisma.product.create({
          data: {
            name: `Test Product ${i}`,
            description: `Description ${i}`,
            priceCents: 10000 + i * 1000,
            currency: "AUD",
            isActive: true,
            modId: testMod.id,
          },
        });
      }

      const request = new NextRequest("http://localhost:3000/api/market-place?page=2&pageSize=5");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(5);
      expect(data.meta.page).toBe(2);
      expect(data.meta.pageSize).toBe(5);
      expect(data.meta.total).toBe(16); // 1 original + 15 new
    });

    it("should only return active products", async () => {
      // Create inactive product
      await prisma.product.create({
        data: {
          name: "Inactive Product",
          description: "This should not appear",
          priceCents: 25000,
          currency: "AUD",
          isActive: false, // Inactive
          modId: testMod.id,
        },
      });

      const request = new NextRequest("http://localhost:3000/api/market-place");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].isActive).toBe(true);
    });

    it("should include mod and compatibility data", async () => {
      const request = new NextRequest("http://localhost:3000/api/market-place");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      const product = data.data[0];

      expect(product.mod).toBeDefined();
      expect(product.mod.category).toBe("tune");
      expect(product.mod.brand).toBe("APR");

      expect(product.compatibility).toBeDefined();
      expect(product.compatibility.hpGain).toBe(30);
      expect(product.compatibility.nmGain).toBe(50);
    });

    it("should handle empty results", async () => {
      const request = new NextRequest("http://localhost:3000/api/market-place?search=nonexistent");

      const response = await marketplaceGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
      expect(data.meta.total).toBe(0);
    });
  });

  describe("Product Data Integrity", () => {
    it("should maintain referential integrity", async () => {
      // Verify the product has proper relationships
      const product = await prisma.product.findUnique({
        where: { id: testProduct.id },
        include: {
          mod: {
            include: {
              ModCategory: true,
            },
          },
          compatibility: {
            include: {
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
          },
        },
      });

      expect(product).toBeTruthy();
      expect(product?.mod.name).toBe("Stage 1 ECU Tune");
      expect(product?.mod.ModCategory?.name).toBe("ECU Tune");
      expect(product?.compatibility?.modelYearRangeObj.badge.model.make.name).toBe("BMW");
      expect(product?.compatibility?.modelYearRangeObj.badge.model.name).toBe("3 Series");
      expect(product?.compatibility?.modelYearRangeObj.badge.name).toBe("320i");
    });

    it("should calculate performance gains correctly", async () => {
      const compatibility = await prisma.modCompatibility.findUnique({
        where: { id: testCompatibility.id },
        include: {
          modelYearRangeObj: true,
        },
      });

      expect(compatibility).toBeTruthy();

      // Base stats
      const baseHp = compatibility?.modelYearRangeObj.hp || 0;
      const baseTorque = compatibility?.modelYearRangeObj.torque || 0;

      // With mod
      const modifiedHp = baseHp + (compatibility?.hpGain || 0);
      const modifiedTorque = baseTorque + (compatibility?.nmGain || 0);

      expect(modifiedHp).toBe(214); // 184 + 30
      expect(modifiedTorque).toBe(320); // 270 + 50
    });
  });
});
