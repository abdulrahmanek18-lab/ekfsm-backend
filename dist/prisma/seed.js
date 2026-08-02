"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...\n');
    console.log('🧹 Cleaning existing data...');
    await prisma.payment.deleteMany({});
    await prisma.itemUsed.deleteMany({});
    await prisma.stockAdjustment.deleteMany({});
    await prisma.purchaseOrderItem.deleteMany({});
    await prisma.purchaseOrder.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.fcmToken.deleteMany({});
    await prisma.quotation.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.workOrder.deleteMany({});
    await prisma.assetServiceHistory.deleteMany({});
    await prisma.pPMSchedule.deleteMany({});
    await prisma.eMISchedule.deleteMany({});
    await prisma.aMC.deleteMany({});
    await prisma.asset.deleteMany({});
    await prisma.flat.deleteMany({});
    await prisma.building.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.serviceCategory.deleteMany({});
    await prisma.company.deleteMany({});
    console.log('✅ Database cleaned\n');
    const company = await prisma.company.create({
        data: {
            name: 'ekFSM Demo Company',
            trn: '1234567890123',
            address: 'Dubai, UAE',
            phone: '+971 4 123 4567',
            email: 'info@ekfsm-demo.com',
            currency: 'AED',
            timezone: 'Asia/Dubai',
            vatPercent: 5,
            invoicePrefix: 'INV-',
            quotationPrefix: 'QUO-',
            poPrefix: 'PO-',
            woPrefix: 'WO-',
            amcPrefix: 'AMC-',
            invoiceHeader: 'Thank you for your business!',
            invoiceFooter: 'Payment due within 30 days.',
        },
    });
    console.log(`✅ Company created: ${company.name} (${company.id})`);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'admin@ekfsm.com',
            password: hashedPassword,
            name: 'System Administrator',
            phone: '+971 50 000 0001',
            role: client_1.UserRole.ADMIN,
            isActive: true,
        },
    });
    console.log(`✅ Admin user created: ${admin.email} / password: admin123`);
    const manager = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'manager@ekfsm.com',
            password: hashedPassword,
            name: 'Facility Manager',
            phone: '+971 50 000 0002',
            role: client_1.UserRole.MANAGER,
            isActive: true,
        },
    });
    console.log(`✅ Manager user created: ${manager.email}`);
    const coordinator = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'coordinator@ekfsm.com',
            password: hashedPassword,
            name: 'Work Coordinator',
            phone: '+971 50 000 0003',
            role: client_1.UserRole.COORDINATOR,
            isActive: true,
        },
    });
    console.log(`✅ Coordinator user created: ${coordinator.email}`);
    const tech1 = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'tech1@ekfsm.com',
            password: hashedPassword,
            name: 'Ahmed - HVAC Technician',
            phone: '+971 50 000 0004',
            role: client_1.UserRole.TECHNICIAN,
            skills: ['HVAC', 'Electrical'],
            isActive: true,
        },
    });
    console.log(`✅ Technician created: ${tech1.name}`);
    const tech2 = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'tech2@ekfsm.com',
            password: hashedPassword,
            name: 'Khalid - Plumbing Technician',
            phone: '+971 50 000 0005',
            role: client_1.UserRole.TECHNICIAN,
            skills: ['Plumbing', 'Carpentry'],
            isActive: true,
        },
    });
    console.log(`✅ Technician created: ${tech2.name}`);
    const accountant = await prisma.user.create({
        data: {
            companyId: company.id,
            email: 'accountant@ekfsm.com',
            password: hashedPassword,
            name: 'Finance Accountant',
            phone: '+971 50 000 0006',
            role: client_1.UserRole.ACCOUNTANT,
            isActive: true,
        },
    });
    console.log(`✅ Accountant user created: ${accountant.email}`);
    const categories = await prisma.serviceCategory.createMany({
        data: [
            { name: 'HVAC', description: 'Heating, Ventilation & Air Conditioning' },
            { name: 'Electrical', description: 'Electrical systems and wiring' },
            { name: 'Plumbing', description: 'Water and drainage systems' },
            { name: 'Carpentry', description: 'Woodwork and fittings' },
            { name: 'Painting', description: 'Interior and exterior painting' },
            { name: 'Cleaning', description: 'General and deep cleaning' },
            { name: 'Pest Control', description: 'Pest management services' },
            { name: 'Fire Safety', description: 'Fire alarm and extinguisher maintenance' },
        ],
    });
    console.log(`✅ ${categories.count} service categories created`);
    const allCategories = await prisma.serviceCategory.findMany();
    const customer1 = await prisma.customer.create({
        data: {
            companyId: company.id,
            name: 'Al Fattan Properties',
            email: 'facilities@alfattan.ae',
            phone: '+971 4 234 5678',
            address: 'Dubai Marina, Dubai',
            trn: '9876543210987',
            isActive: true,
        },
    });
    console.log(`✅ Customer created: ${customer1.name}`);
    const customer2 = await prisma.customer.create({
        data: {
            companyId: company.id,
            name: 'Emirates Hills Residences',
            email: 'management@emirateshills.ae',
            phone: '+971 4 345 6789',
            address: 'Emirates Hills, Dubai',
            trn: '8765432109876',
            isActive: true,
        },
    });
    console.log(`✅ Customer created: ${customer2.name}`);
    const building1 = await prisma.building.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            name: 'Marina Tower A',
            address: 'Dubai Marina, Street 12',
            city: 'Dubai',
            emirate: 'Dubai',
            latitude: 25.2048,
            longitude: 55.2708,
        },
    });
    console.log(`✅ Building created: ${building1.name}`);
    const building2 = await prisma.building.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            name: 'Marina Tower B',
            address: 'Dubai Marina, Street 14',
            city: 'Dubai',
            emirate: 'Dubai',
            latitude: 25.2050,
            longitude: 55.2710,
        },
    });
    console.log(`✅ Building created: ${building2.name}`);
    const building3 = await prisma.building.create({
        data: {
            companyId: company.id,
            customerId: customer2.id,
            name: 'Palm Villa Complex',
            address: 'Emirates Hills, Sector 3',
            city: 'Dubai',
            emirate: 'Dubai',
            latitude: 25.0657,
            longitude: 55.2076,
        },
    });
    console.log(`✅ Building created: ${building3.name}`);
    const flats = [];
    for (let i = 1; i <= 5; i++) {
        const flat = await prisma.flat.create({
            data: {
                buildingId: building1.id,
                unitNumber: `10${i}`,
                floor: 10,
                type: i % 2 === 0 ? '2BHK' : '1BHK',
                areaSqft: i % 2 === 0 ? 1200 : 850,
            },
        });
        flats.push(flat);
    }
    console.log(`✅ ${flats.length} flats created in ${building1.name}`);
    const asset1 = await prisma.asset.create({
        data: {
            companyId: company.id,
            buildingId: building1.id,
            flatId: flats[0].id,
            serviceCategoryId: allCategories[0].id,
            assetNumber: 'AST-00001',
            name: 'Split AC Unit - Living Room',
            description: 'Daikin 2.5 Ton Split AC',
            manufacturer: 'Daikin',
            model: 'FTXS60G',
            serialNumber: 'DAK2024001',
            location: 'Living Room',
            installedDate: new Date('2023-01-15'),
            warrantyExpiry: new Date('2026-01-15'),
            status: client_1.AssetStatus.ACTIVE,
        },
    });
    console.log(`✅ Asset created: ${asset1.name}`);
    const asset2 = await prisma.asset.create({
        data: {
            companyId: company.id,
            buildingId: building1.id,
            flatId: flats[1].id,
            serviceCategoryId: allCategories[1].id,
            assetNumber: 'AST-00002',
            name: 'Main Distribution Board',
            description: 'Schneider 3-Phase MDB',
            manufacturer: 'Schneider Electric',
            model: 'PrismaSeT S',
            serialNumber: 'SCH2024002',
            location: 'Electrical Room',
            installedDate: new Date('2022-06-10'),
            warrantyExpiry: new Date('2025-06-10'),
            status: client_1.AssetStatus.ACTIVE,
        },
    });
    console.log(`✅ Asset created: ${asset2.name}`);
    const items = await prisma.inventoryItem.createMany({
        data: [
            { companyId: company.id, sku: 'FIL-001', name: 'AC Filter 16x25x1', unit: 'pcs', quantity: 50, minStock: 10, costPrice: 15, sellingPrice: 25, location: 'Warehouse A' },
            { companyId: company.id, sku: 'GAS-001', name: 'R410A Refrigerant 3kg', unit: 'cylinder', quantity: 12, minStock: 3, costPrice: 120, sellingPrice: 180, location: 'Warehouse A' },
            { companyId: company.id, sku: 'CAP-001', name: 'Capacitor 45/5 MFD', unit: 'pcs', quantity: 30, minStock: 5, costPrice: 8, sellingPrice: 15, location: 'Warehouse B' },
            { companyId: company.id, sku: 'LED-001', name: 'LED Panel 600x600', unit: 'pcs', quantity: 100, minStock: 20, costPrice: 25, sellingPrice: 40, location: 'Warehouse B' },
            { companyId: company.id, sku: 'PIPE-001', name: 'PVC Pipe 1 inch', unit: 'meter', quantity: 200, minStock: 50, costPrice: 3, sellingPrice: 5, location: 'Warehouse C' },
            { companyId: company.id, sku: 'SEAL-001', name: 'Rubber Gasket Set', unit: 'set', quantity: 40, minStock: 10, costPrice: 5, sellingPrice: 10, location: 'Warehouse C' },
        ],
    });
    console.log(`✅ ${items.count} inventory items created`);
    const wo1 = await prisma.workOrder.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            buildingId: building1.id,
            flatId: flats[0].id,
            assetId: asset1.id,
            serviceCategoryId: allCategories[0].id,
            technicianId: tech1.id,
            woNumber: 'WO-00001',
            title: 'AC Not Cooling - Unit 101',
            description: 'Tenant reports AC blowing warm air. Needs inspection and gas refill.',
            priority: client_1.Priority.HIGH,
            status: client_1.WOStatus.COMPLETED,
            scheduledDate: new Date('2026-07-25'),
            startedAt: new Date('2026-07-25T09:00:00Z'),
            completedAt: new Date('2026-07-25T11:30:00Z'),
            actualCost: 180,
            technicianNotes: 'Replaced capacitor and refilled R410A gas. Unit working normally.',
        },
    });
    console.log(`✅ Work Order created: ${wo1.woNumber}`);
    const wo2 = await prisma.workOrder.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            buildingId: building1.id,
            flatId: flats[1].id,
            assetId: asset2.id,
            serviceCategoryId: allCategories[1].id,
            technicianId: tech1.id,
            woNumber: 'WO-00002',
            title: 'MDB Tripping - Unit 102',
            description: 'Frequent tripping of main breaker. Needs electrical inspection.',
            priority: client_1.Priority.URGENT,
            status: client_1.WOStatus.IN_PROGRESS,
            scheduledDate: new Date('2026-07-31'),
            startedAt: new Date('2026-07-31T08:00:00Z'),
            technicianNotes: 'Found loose connection in Phase B. Tightening and testing.',
        },
    });
    console.log(`✅ Work Order created: ${wo2.woNumber}`);
    const wo3 = await prisma.workOrder.create({
        data: {
            companyId: company.id,
            customerId: customer2.id,
            buildingId: building3.id,
            serviceCategoryId: allCategories[2].id,
            technicianId: tech2.id,
            woNumber: 'WO-00003',
            title: 'Leak in Master Bathroom',
            description: 'Water leaking from ceiling in master bathroom. Possible pipe burst.',
            priority: client_1.Priority.HIGH,
            status: client_1.WOStatus.PENDING,
            scheduledDate: new Date('2026-08-01'),
        },
    });
    console.log(`✅ Work Order created: ${wo3.woNumber}`);
    const invoice1 = await prisma.invoice.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            workOrderId: wo1.id,
            invoiceNumber: 'INV-00001',
            issueDate: new Date('2026-07-25'),
            dueDate: new Date('2026-08-24'),
            subtotal: 180,
            vatRate: 5,
            vatAmount: 9,
            total: 189,
            amountPaid: 189,
            balanceDue: 0,
            status: client_1.InvoiceStatus.PAID,
            notes: 'Payment received via bank transfer.',
        },
    });
    console.log(`✅ Invoice created: ${invoice1.invoiceNumber}`);
    await prisma.payment.create({
        data: {
            invoiceId: invoice1.id,
            amount: 189,
            method: client_1.PaymentMethod.BANK_TRANSFER,
            referenceNo: 'TRF-20260725-001',
            paidAt: new Date('2026-07-26'),
            notes: 'Full payment received',
        },
    });
    console.log(`✅ Payment recorded for ${invoice1.invoiceNumber}`);
    const invoice2 = await prisma.invoice.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            workOrderId: wo2.id,
            invoiceNumber: 'INV-00002',
            issueDate: new Date('2026-07-31'),
            dueDate: new Date('2026-08-30'),
            subtotal: 250,
            vatRate: 5,
            vatAmount: 12.5,
            total: 262.5,
            amountPaid: 0,
            balanceDue: 262.5,
            status: client_1.InvoiceStatus.SENT,
            notes: 'Awaiting payment confirmation.',
        },
    });
    console.log(`✅ Invoice created: ${invoice2.invoiceNumber}`);
    const amc1 = await prisma.aMC.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            assetId: asset1.id,
            serviceCategoryId: allCategories[0].id,
            contractNumber: 'AMC-00001',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            value: 5000,
            paymentType: client_1.AMCPaymentType.EMI,
            ppmFrequency: 3,
            status: client_1.AMCStatus.ACTIVE,
        },
    });
    console.log(`✅ AMC created: ${amc1.contractNumber}`);
    const ppmDates = [
        new Date('2026-03-01'),
        new Date('2026-06-01'),
        new Date('2026-09-01'),
        new Date('2026-12-01'),
    ];
    for (const date of ppmDates) {
        await prisma.pPMSchedule.create({
            data: {
                amcId: amc1.id,
                scheduledAt: date,
                status: date < new Date() ? client_1.PPMStatus.COMPLETED : client_1.PPMStatus.SCHEDULED,
            },
        });
    }
    console.log(`✅ 4 PPM schedules created for ${amc1.contractNumber}`);
    const emiAmount = 5000 / 12;
    for (let i = 0; i < 12; i++) {
        const dueDate = new Date('2026-01-15');
        dueDate.setMonth(dueDate.getMonth() + i);
        await prisma.eMISchedule.create({
            data: {
                amcId: amc1.id,
                amount: parseFloat(emiAmount.toFixed(2)),
                dueDate,
                status: i < 7 ? client_1.EMIStatus.PAID : client_1.EMIStatus.PENDING,
                paidAt: i < 7 ? dueDate : null,
            },
        });
    }
    console.log(`✅ 12 EMI schedules created for ${amc1.contractNumber}`);
    const po1 = await prisma.purchaseOrder.create({
        data: {
            companyId: company.id,
            poNumber: 'PO-00001',
            supplierName: 'CoolTech HVAC Supplies',
            supplierEmail: 'sales@cooltech.ae',
            supplierPhone: '+971 4 567 8901',
            subtotal: 360,
            vatAmount: 18,
            total: 378,
            status: client_1.POStatus.RECEIVED,
            receivedAt: new Date('2026-07-20'),
            notes: 'Bulk order for AC maintenance season',
        },
    });
    console.log(`✅ Purchase Order created: ${po1.poNumber}`);
    const expense1 = await prisma.expense.create({
        data: {
            companyId: company.id,
            category: 'Fuel',
            amount: 150,
            description: 'Fuel for service van - Week 30',
            status: client_1.ExpenseStatus.APPROVED,
            createdById: tech1.id,
            approvedById: manager.id,
            expenseDate: new Date('2026-07-25'),
        },
    });
    console.log(`✅ Expense created: ${expense1.category} - AED ${expense1.amount}`);
    const expense2 = await prisma.expense.create({
        data: {
            companyId: company.id,
            category: 'Tools',
            amount: 450,
            description: 'New multimeter and wire strippers',
            status: client_1.ExpenseStatus.PENDING,
            createdById: tech2.id,
            expenseDate: new Date('2026-07-30'),
        },
    });
    console.log(`✅ Expense created: ${expense2.category} - AED ${expense2.amount}`);
    await prisma.notification.createMany({
        data: [
            {
                companyId: company.id,
                userId: tech1.id,
                title: 'New Work Order Assigned',
                body: 'WO-00002: MDB Tripping - Unit 102 has been assigned to you.',
                type: client_1.NotificationType.WORK_ORDER_ASSIGNED,
            },
            {
                companyId: company.id,
                userId: coordinator.id,
                title: 'Invoice Overdue',
                body: 'Invoice INV-00002 is now overdue. Follow up with customer.',
                type: client_1.NotificationType.INVOICE_OVERDUE,
            },
            {
                companyId: company.id,
                userId: manager.id,
                title: 'Expense Approval Required',
                body: 'Tech Khalid has submitted an expense of AED 450 for tools.',
                type: client_1.NotificationType.GENERAL,
            },
        ],
    });
    console.log(`✅ 3 notifications created`);
    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n─────────────────────────────────────');
    console.log('Login Credentials:');
    console.log('  Email: admin@ekfsm.com');
    console.log('  Password: admin123');
    console.log('─────────────────────────────────────');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map