import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/validations", () => ({
  MarketPlacePaginationSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("@/types/DTO/MarketPlaceDTO", () => ({
  toProductDTO: vi.fn(),
}));

import { GET } from "@/app/api/market-place/route";

describe("Market Place API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return products with default pagination", async () => {
    const mockProducts = [
      {
        id: "cmg98y5du000fock3azfcvudc",
        name: "Stage 1 ECU Tune BMW 3 Series 320i 2013-2018",
        description: "Stage 1 ECU tune for stock hardware",
        priceCents: 58400,
        currency: "AUD",
        stock: null,
        isActive: true,
        imageUrl: "https://example.com/product.jpg",
        modId: "cmg98y52f000nocjg9ccjhln1",
        compatibilityId: "cmg98y52m0019ocjgirtc17xx",
        createdAt: new Date("2025-10-02T10:02:33.282Z"),
        updatedAt: new Date("2025-10-02T10:02:33.282Z"),
        mod: {
          id: "cmg98y52f000nocjg9ccjhln1",
          name: "Stage 1 ECU Tune",
          brand: "APR",
          category: "tune",
        },
        compatibility: {
          id: "cmg98y52m0019ocjgirtc17xx",
          modelYearRange: "2013-2018",
          modelYearRangeObj: {
            badge: {
              name: "320i",
              model: {
                name: "3 Series",
                make: {
                  name: "BMW",
                },
              },
            },
          },
        },
      },
    ];

    const mockFormattedProducts = [
      {
        id: "cmg98y5du000fock3azfcvudc",
        name: "Stage 1 ECU Tune BMW 3 Series 320i 2013-2018",
        description: "Stage 1 ECU tune for stock hardware",
        imageUrl: "https://example.com/product.jpg",
        price: {
          amountCents: 58400,
          currency: "AUD",
          formatted: "AUD 584.00",
        },
        stock: null,
        isActive: true,
        compatibility: {
          id: "cmg98y52m0019ocjgirtc17xx",
          make: "BMW",
          model: "3 Series",
          badge: "320i",
          yearRange: "2013-2018",
        },
        mod: {
          id: "cmg98y52f000nocjg9ccjhln1",
          brand: "APR",
          category: "tune",
        },
        createdAt: "2025-10-02T10:02:33.282Z",
        updatedAt: "2025-10-02T10:02:33.282Z",
      },
    ];

    const { prisma } = await import("@/lib/prisma");
    const { MarketPlacePaginationSchema } = await import("@/lib/validations");
    const { toProductDTO } = await import("@/types/DTO/MarketPlaceDTO");

    vi.mocked(MarketPlacePaginationSchema.parse).mockReturnValue({
      page: 1,
      pageSize: 50,
      search: undefined,
      sort: "createdAt_asc",
      category: undefined,
      brand: undefined,
      make: undefined,
      model: undefined,
      badge: undefined,
      year: undefined,
    });

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts);
    vi.mocked(prisma.product.count).mockResolvedValue(1);
    vi.mocked(toProductDTO).mockReturnValue(mockFormattedProducts[0]);

    const request = new NextRequest("http://localhost:3000/api/market-place");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockFormattedProducts);
    expect(data.meta.page).toBe(1);
    expect(data.meta.pageSize).toBe(50);
    expect(data.meta.total).toBe(1);

    expect(MarketPlacePaginationSchema.parse).toHaveBeenCalledOnce();
    expect(prisma.product.findMany).toHaveBeenCalledOnce();
    expect(prisma.product.count).toHaveBeenCalledWith({ where: { isActive: true } });
    expect(toProductDTO).toHaveBeenCalledWith(mockProducts[0], 0, mockProducts);
  });

  it("should handle search parameter", async () => {
    const { prisma } = await import("@/lib/prisma");
    const { MarketPlacePaginationSchema } = await import("@/lib/validations");

    vi.mocked(MarketPlacePaginationSchema.parse).mockReturnValue({
      page: 1,
      pageSize: 50,
      search: "turbo",
      sort: "createdAt_asc",
    });

    vi.mocked(prisma.product.findMany).mockResolvedValue([]);
    vi.mocked(prisma.product.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost:3000/api/market-place?search=turbo");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
          OR: expect.arrayContaining([
            { name: { contains: "turbo", mode: "insensitive" } },
            { description: { contains: "turbo", mode: "insensitive" } },
            { mod: { brand: { contains: "turbo", mode: "insensitive" } } },
            { mod: { category: { contains: "turbo", mode: "insensitive" } } },
          ]),
        }),
      })
    );
  });

  it("should handle sorting parameters", async () => {
    const { prisma } = await import("@/lib/prisma");
    const { MarketPlacePaginationSchema } = await import("@/lib/validations");

    vi.mocked(MarketPlacePaginationSchema.parse).mockReturnValue({
      page: 1,
      pageSize: 50,
      sort: "price_desc",
    });

    vi.mocked(prisma.product.findMany).mockResolvedValue([]);
    vi.mocked(prisma.product.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost:3000/api/market-place?sort=price_desc");

    const response = await GET(request);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { priceCents: "desc" },
      })
    );
  });

  it("should handle errors gracefully", async () => {
    const { MarketPlacePaginationSchema } = await import("@/lib/validations");

    vi.mocked(MarketPlacePaginationSchema.parse).mockImplementation(() => {
      throw new Error("Invalid parameters");
    });

    const request = new NextRequest("http://localhost:3000/api/market-place");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
