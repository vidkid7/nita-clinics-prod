import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentGatewayName } from './entities/payment-transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { ReceiptService } from './receipt.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly receiptService: ReceiptService,
  ) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment (patient account required)' })
  initiate(@Body() payload: InitiatePaymentDto, @Req() req: { user: { email: string; name: string } }) {
    const user = req.user;
    return this.paymentsService.initiate({
      ...payload,
      customerEmail: user.email,
      customerName: (payload.customerName?.trim() || user.name || '').trim() || undefined,
    });
  }

  @Post('demo-complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete payment in demo mode (development / PAYMENT_DEMO_ENABLED); patient only',
  })
  demoComplete(@Body() payload: InitiatePaymentDto, @Req() req: { user: { email: string; name: string } }) {
    const user = req.user;
    return this.paymentsService.completeDemoPayment({
      ...payload,
      customerEmail: user.email,
      customerName: (payload.customerName?.trim() || user.name || '').trim() || undefined,
    });
  }

  @Post('callback/:gateway')
  @Public()
  @ApiOperation({ summary: 'Handle gateway callback/webhook (POST)' })
  handleCallback(
    @Param('gateway') gateway: PaymentGatewayName,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.paymentsService.handleCallback(gateway, payload);
  }

  @Get('callback/:gateway')
  @Public()
  @ApiOperation({ summary: 'Handle gateway callback/redirect (GET - used by Fonepay)' })
  handleCallbackGet(
    @Param('gateway') gateway: PaymentGatewayName,
    @Query() payload: Record<string, unknown>,
  ) {
    return this.paymentsService.handleCallback(gateway, payload);
  }

  @Get('verify/:reference')
  @Public()
  @ApiOperation({ summary: 'Verify payment transaction by reference' })
  verify(@Param('reference') reference: string) {
    return this.paymentsService.verify(reference);
  }

  @Get('my-transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my payment transactions (patient)' })
  getMyTransactions(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.findByCustomerEmail(
      req.user.email,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List payment transactions (admin)' })
  @ApiQuery({ name: 'limit', required: false })
  listTransactions(@Query('limit') limit?: string) {
    return this.paymentsService.listTransactions(limit ? Number(limit) : 50);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment settings' })
  getSettings() {
    return this.paymentsService.getPaymentSettings();
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment settings' })
  updateSettings(@Body() payload: UpdatePaymentSettingsDto) {
    return this.paymentsService.updatePaymentSettings(payload);
  }

  @Get(':reference/receipt')
  @Public()
  @ApiOperation({ summary: 'Get payment receipt data' })
  getReceipt(@Param('reference') reference: string) {
    return this.receiptService.generateReceipt(reference);
  }

  @Get(':reference/receipt/html')
  @Public()
  @ApiOperation({ summary: 'Get payment receipt as HTML' })
  async getReceiptHtml(@Param('reference') reference: string, @Res() res: any) {
    const html = await this.receiptService.getReceiptHtml(reference);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
