import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { Roles } from './modules/auth/decorators/roles.decorator';
import { UserRole } from './modules/users/entities/user.entity';
import { RedisCacheService } from './common/cache/redis-cache.service';

@Controller()
export class AppController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly redisCache: RedisCacheService,
  ) {}

  @Get()
  getRoot() {
    return {
      name: 'Nita Clinic API',
      version: '1.0',
      status: 'running',
      docs: '/docs',
      api: '/api/v1',
    };
  }

  @Get('health')
  async getHealth() {
    const dbOk = await this.checkDatabase();
    let redis: 'connected' | 'skipped' | 'error' = 'skipped';
    if (this.redisCache.isReady) {
      redis = (await this.redisCache.ping()) ? 'connected' : 'error';
    }
    const ok = dbOk && redis !== 'error';
    return {
      status: ok ? 'ok' : 'error',
      database: dbOk ? 'connected' : 'disconnected',
      redis,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const result = await this.dataSource.query('SELECT 1 as ok');
      return Array.isArray(result) && result.length > 0 && (result[0]?.ok === 1 || result[0]?.ok === '1');
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  @Get('admin/dashboard/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async getDashboardStats() {
    const safeCount = async (table: string, where = '') => {
      try {
        const sql = `SELECT COUNT(*) as count FROM "${table}"${where ? ' WHERE ' + where : ''}`;
        const rows = await this.dataSource.query(sql);
        return parseInt(rows?.[0]?.count ?? '0', 10);
      } catch {
        return 0;
      }
    };

    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      totalLabOrders,
      totalRevenue,
      totalEnquiries,
      newEnquiries,
      pendingLabOrders,
      totalLabReports,
      pendingHomeCollections,
    ] = await Promise.all([
      safeCount('patients'),
      safeCount('doctors', 'is_active = true'),
      safeCount('appointments'),
      safeCount('appointments', `date = '${today}'`),
      safeCount('appointments', `status = 'pending'`),
      safeCount('lab_orders'),
      this.dataSource.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payment_transactions WHERE status = 'success'`
      ).then((r) => parseFloat(r?.[0]?.total ?? '0')).catch(() => 0),
      safeCount('enquiries'),
      safeCount('enquiries', `status = 'new'`),
      safeCount('lab_orders', `status = 'placed' OR status = 'confirmed'`),
      safeCount('lab_reports'),
      safeCount('home_collections', `status = 'requested'`),
    ]);

    return {
      patients: { total: totalPatients },
      doctors: { total: totalDoctors },
      appointments: {
        total: totalAppointments,
        today: todayAppointments,
        pending: pendingAppointments,
      },
      labOrders: { total: totalLabOrders, pending: pendingLabOrders },
      labReports: { total: totalLabReports },
      enquiries: { total: totalEnquiries, new: newEnquiries },
      revenue: { total: totalRevenue },
      homeCollections: { pending: pendingHomeCollections },
    };
  }
}
