import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
})
export class AppModule {}
