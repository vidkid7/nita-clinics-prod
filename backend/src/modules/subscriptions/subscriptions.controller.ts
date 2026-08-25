import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // ─── Public: list active plans ────────────────────────────────────────────
  @Get('plans')
  @Public()
  @ApiOperation({ summary: 'Get all active subscription plans' })
  findPlans(@Query('includeInactive') includeInactive?: string) {
    return this.subscriptionsService.findAllPlans(includeInactive === 'true');
  }

  @Get('plans/:id')
  @Public()
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  findPlan(@Param('id') id: string) {
    return this.subscriptionsService.findPlan(id);
  }

  // ─── Admin: manage plans ─────────────────────────────────────────────────
  @Post('plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subscription plan' })
  createPlan(@Body() dto: CreateSubscriptionPlanDto) {
    return this.subscriptionsService.createPlan(dto);
  }

  @Patch('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription plan' })
  updatePlan(@Param('id') id: string, @Body() dto: Partial<CreateSubscriptionPlanDto>) {
    return this.subscriptionsService.updatePlan(id, dto);
  }

  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete subscription plan' })
  removePlan(@Param('id') id: string) {
    return this.subscriptionsService.removePlan(id);
  }

  // ─── Admin: manage subscriptions ─────────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all subscriptions (admin)' })
  findAll(@Query('patientId') patientId?: string) {
    return this.subscriptionsService.findAllSubscriptions(patientId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subscription for patient' })
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a subscription' })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.subscriptionsService.cancelSubscription(id, req.user.email);
  }

  // ─── Patient: my subscriptions ────────────────────────────────────────────
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my subscriptions (patient)' })
  getMySubscriptions(@Req() req: any) {
    return this.subscriptionsService.findByPatientId(req.user.patientId || req.user.id);
  }
}
