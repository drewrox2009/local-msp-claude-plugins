/**
 * Tests for the lazy-loaded RepairShopr client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCredentials, getClient, clearClient } from "../../src/utils/client.js";

// Mock the vendored Syncro client used for RepairShopr compatibility
vi.mock("../../src/vendor/node-syncro/index.js", () => ({
  SyncroClient: vi.fn().mockImplementation((config) => ({
    config,
    customers: { list: vi.fn(), get: vi.fn(), create: vi.fn() },
    tickets: { list: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn(), addComment: vi.fn() },
    assets: { list: vi.fn(), get: vi.fn() },
    contacts: { list: vi.fn(), get: vi.fn(), create: vi.fn() },
    invoices: { list: vi.fn(), get: vi.fn(), create: vi.fn(), email: vi.fn() },
  })),
}));

describe("client.ts", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
    // Clear the cached client between tests
    clearClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getCredentials", () => {
    it("should return null when REPAIRSHOPR_API_KEY is not set", () => {
      delete process.env.REPAIRSHOPR_API_KEY;
      delete process.env.REPAIRSHOPR_SUBDOMAIN;

      const creds = getCredentials();
      expect(creds).toBeNull();
    });

    it("should return credentials with only apiKey when REPAIRSHOPR_SUBDOMAIN is not set", () => {
      process.env.REPAIRSHOPR_API_KEY = "test-api-key";
      delete process.env.REPAIRSHOPR_SUBDOMAIN;

      const creds = getCredentials();
      expect(creds).toEqual({
        apiKey: "test-api-key",
        subdomain: undefined,
      });
    });

    it("should return credentials with both apiKey and subdomain", () => {
      process.env.REPAIRSHOPR_API_KEY = "test-api-key";
      process.env.REPAIRSHOPR_SUBDOMAIN = "mycompany";

      const creds = getCredentials();
      expect(creds).toEqual({
        apiKey: "test-api-key",
        subdomain: "mycompany",
      });
    });
  });

  describe("getClient", () => {
    it("should throw error when no credentials are configured", async () => {
      delete process.env.REPAIRSHOPR_API_KEY;

      await expect(getClient()).rejects.toThrow(
        "No API credentials provided. Please configure REPAIRSHOPR_API_KEY environment variable."
      );
    });

    it("should create client with correct configuration", async () => {
      process.env.REPAIRSHOPR_API_KEY = "test-api-key";
      process.env.REPAIRSHOPR_SUBDOMAIN = "mycompany";

      const client = await getClient();

      expect(client).toBeDefined();
      expect(client.config).toEqual({
        apiKey: "test-api-key",
        baseUrl: "https://mycompany.repairshopr.com",
      });
    });

    it("should return cached client on subsequent calls", async () => {
      process.env.REPAIRSHOPR_API_KEY = "test-api-key";

      const client1 = await getClient();
      const client2 = await getClient();

      expect(client1).toBe(client2);
    });

    it("should create new client when credentials change", async () => {
      const { SyncroClient } = await import("../../src/vendor/node-syncro/index.js");
      const mockSyncroClient = vi.mocked(SyncroClient);

      process.env.REPAIRSHOPR_API_KEY = "first-api-key";
      await getClient();

      // Verify first call with first credentials
      expect(mockSyncroClient).toHaveBeenCalledWith({
        apiKey: "first-api-key",
        baseUrl: "https://repairshopr.com",
      });

      // Clear and change credentials
      clearClient();
      mockSyncroClient.mockClear();

      process.env.REPAIRSHOPR_API_KEY = "second-api-key";
      await getClient();

      // Verify second call with new credentials
      expect(mockSyncroClient).toHaveBeenCalledWith({
        apiKey: "second-api-key",
        baseUrl: "https://repairshopr.com",
      });
    });

    it("should create new client when subdomain changes", async () => {
      const { SyncroClient } = await import("../../src/vendor/node-syncro/index.js");
      const mockSyncroClient = vi.mocked(SyncroClient);

      process.env.REPAIRSHOPR_API_KEY = "test-api-key";
      process.env.REPAIRSHOPR_SUBDOMAIN = "company1";
      await getClient();

      // Verify first call
      expect(mockSyncroClient).toHaveBeenCalledWith({
        apiKey: "test-api-key",
        baseUrl: "https://company1.repairshopr.com",
      });

      // Clear and change subdomain
      clearClient();
      mockSyncroClient.mockClear();

      process.env.REPAIRSHOPR_SUBDOMAIN = "company2";
      await getClient();

      // Verify second call with new subdomain
      expect(mockSyncroClient).toHaveBeenCalledWith({
        apiKey: "test-api-key",
        baseUrl: "https://company2.repairshopr.com",
      });
    });
  });

  describe("clearClient", () => {
    it("should clear the cached client", async () => {
      process.env.REPAIRSHOPR_API_KEY = "test-api-key";

      const client1 = await getClient();
      clearClient();
      const client2 = await getClient();

      // After clearing, a new client instance should be created
      expect(client1).not.toBe(client2);
    });
  });
});
