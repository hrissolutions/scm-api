import { controller } from "../app/supplier/supplier.controller";
import { expect } from "chai";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../generated/prisma";

const TEST_TIMEOUT = 5000;

describe("Supplier Controller", () => {
	let supplierController: any;
	let req: Partial<Request>;
	let res: Response;
	let next: NextFunction;
	let prisma: any;
	let sentData: any;
	let statusCode: number;
	const mockSupplier = {
		id: "507f1f77bcf86cd799439026",
		name: "Test Supplier",
		code: "SUP-001",
		description: "Test supplier",
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(() => {
		prisma = {
			supplier: {
				findMany: async (_params: Prisma.SupplierFindManyArgs) => [mockSupplier],
				count: async (_params: Prisma.SupplierCountArgs) => 1,
				findFirst: async (params: Prisma.SupplierFindFirstArgs) =>
					params.where?.id === mockSupplier.id ? mockSupplier : null,
				create: async (params: Prisma.SupplierCreateArgs) => ({
					...mockSupplier,
					...params.data,
				}),
				update: async (params: Prisma.SupplierUpdateArgs) => ({
					...mockSupplier,
					...params.data,
				}),
				delete: async (params: Prisma.SupplierDeleteArgs) => ({
					...mockSupplier,
					id: params.where.id,
				}),
			},
		};

		supplierController = controller(prisma as PrismaClient);
		sentData = undefined;
		statusCode = 200;
		req = {
			query: {},
			params: {},
			body: {},
			get: (header: string) => {
				if (header === "Content-Type") {
					return "application/json";
				}
				return undefined;
			},
			originalUrl: "/api/supplier",
		} as Request;
		res = {
			send: (data: any) => {
				sentData = data;
				return res;
			},
			status: (code: number) => {
				statusCode = code;
				return res;
			},
			json: (data: any) => {
				sentData = data;
				return res;
			},
			end: () => res,
		} as Response;
		next = () => {};
	});

	describe(".getAll()", () => {
		it("should return paginated suppliers", async function () {
			this.timeout(TEST_TIMEOUT);
			req.query = { page: "1", limit: "10" };
			await supplierController.getAll(req as Request, res, next);
			expect(statusCode).to.equal(200);
			expect(sentData).to.have.property("status", "success");
		});
	});

	describe(".getById()", () => {
		it("should return a supplier", async function () {
			this.timeout(TEST_TIMEOUT);
			req.params = { id: mockSupplier.id };
			await supplierController.getById(req as Request, res, next);
			expect(statusCode).to.equal(200);
			expect(sentData).to.have.property("status", "success");
		});
	});

	describe(".create()", () => {
		it("should create a new supplier", async function () {
			this.timeout(TEST_TIMEOUT);
			const createData = {
				name: "New Supplier",
				code: "SUP-002",
				description: "New supplier description",
			};
			req.body = createData;
			await supplierController.create(req as Request, res, next);
			expect(statusCode).to.equal(201);
			expect(sentData).to.have.property("status", "success");
		});
	});
});
