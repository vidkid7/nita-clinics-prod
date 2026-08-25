import {
  Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';
import { UpdateLabOrderItemDto } from './dto/update-lab-order-item.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { LabOrderStatus } from './entities/lab-order.entity';

@ApiTags('lab-orders')
@Controller('lab-orders')
export class LabOrdersController {
  constructor(private readonly labOrdersService: LabOrdersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Place a lab test order' })
  create(@Body() dto: CreateLabOrderDto) {
    return this.labOrdersService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List lab orders (admin)' })
  @ApiQuery({ name: 'status', required: false, enum: LabOrderStatus })
  findAll(@Query() pagination: PaginationDto, @Query('status') status?: LabOrderStatus) {
    return this.labOrdersService.findAll(pagination, status);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my lab orders (patient)' })
  async getMyOrders(@Req() req: any, @Query() pagination: PaginationDto) {
    return this.labOrdersService.findByUserId(req.user.id, pagination);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics' })
  getStats() {
    return this.labOrdersService.getStats();
  }

  @Get('track/:orderNumber')
  @Public()
  @ApiOperation({ summary: 'Track order by order number' })
  track(@Param('orderNumber') orderNumber: string) {
    return this.labOrdersService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab order by ID' })
  findOne(@Param('id') id: string) {
    return this.labOrdersService.findOne(id);
  }

  @Patch('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lab order item status' })
  updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateLabOrderItemDto) {
    return this.labOrdersService.updateItemStatus(itemId, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel lab order' })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.labOrdersService.cancel(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lab order' })
  update(@Param('id') id: string, @Body() dto: UpdateLabOrderDto) {
    return this.labOrdersService.update(id, dto);
  }
}
