"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const company_module_1 = require("./company/company.module");
const services_module_1 = require("./services/services.module");
const customers_module_1 = require("./customers/customers.module");
const buildings_module_1 = require("./buildings/buildings.module");
const flats_module_1 = require("./flats/flats.module");
const assets_module_1 = require("./assets/assets.module");
const work_orders_module_1 = require("./work-orders/work-orders.module");
const inventory_module_1 = require("./inventory/inventory.module");
const invoices_module_1 = require("./invoices/invoices.module");
const reports_module_1 = require("./reports/reports.module");
const notifications_module_1 = require("./notifications/notifications.module");
const po_module_1 = require("./po/po.module");
const expenses_module_1 = require("./expenses/expenses.module");
const upload_module_1 = require("./upload/upload.module");
const gateway_module_1 = require("./gateway/gateway.module");
const prisma_module_1 = require("./prisma/prisma.module");
const amc_module_1 = require("./amc/amc.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            company_module_1.CompanyModule,
            services_module_1.ServicesModule,
            customers_module_1.CustomersModule,
            buildings_module_1.BuildingsModule,
            flats_module_1.FlatsModule,
            assets_module_1.AssetsModule,
            work_orders_module_1.WorkOrdersModule,
            inventory_module_1.InventoryModule,
            invoices_module_1.InvoicesModule,
            reports_module_1.ReportsModule,
            notifications_module_1.NotificationsModule,
            po_module_1.POModule,
            expenses_module_1.ExpensesModule,
            upload_module_1.UploadModule,
            gateway_module_1.GatewayModule,
            amc_module_1.AmcModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map