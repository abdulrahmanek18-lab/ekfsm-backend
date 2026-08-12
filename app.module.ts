import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { ServicesModule } from './services/services.module';
import { CustomersModule } from './customers/customers.module';
import { BuildingsModule } from './buildings/buildings.module';
import { FlatsModule } from './flats/flats.module';
import { AssetsModule } from './assets/assets.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { POModule } from './po/po.module';
import { ExpensesModule } from './expenses/expenses.module';
import { UploadModule } from './upload/upload.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrismaModule } from './prisma/prisma.module';
import { AmcModule } from './amc/amc.module';
import { QrModule } from './qr/qr.module';
import { PdfModule } from './pdf/pdf.module';
import { SettingsModule } from './settings/settings.module';
import { StaffModule } from './staff/staff.module';

// Guards
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    ServicesModule,
    CustomersModule,
    BuildingsModule,
    FlatsModule,
    AssetsModule,
    WorkOrdersModule,
    InventoryModule,
    InvoicesModule,
    ReportsModule,
    NotificationsModule,
    POModule,
    ExpensesModule,
    UploadModule,
    GatewayModule,
    AmcModule,
    QrModule,
    PdfModule,
    SettingsModule,
    StaffModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 1. Ensures every route requires login (unless @Public())
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // 2. Ensures every route requires specific roles (Deny by Default)
    },
  ],
})
export class AppModule {}
