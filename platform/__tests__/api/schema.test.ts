import { GET } from "@/app/api/v1/schema/route";

describe("GET /api/v1/schema", () => {
  it("returns 200 with JSON object", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json).toBe("object");
    expect(json).not.toBeNull();
  });

  it("returns schema with title field", async () => {
    const res = await GET();
    const json = await res.json();
    expect(json).toHaveProperty("title");
  });
});
