import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    create: jest.fn((dto: CreateOrderDto) => dto),
    findAll: jest.fn(() => [mockOrder, mockOrder]),
    update: jest.fn((id: string, dto: UpdateOrderDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({
      message: 'Order deleted',
      order: { id, ...mockOrder },
    })),
    findOne: jest.fn((id: string) => ({ id, ...mockOrder })),
  };

  const mockOrder: CreateOrderDto = {
    user: 'some user',
    products: ['product1', 'product2'],
    total: 50,
    status: 'delivered',
  };

  const mockUpdateOrder: UpdateOrderDto = {
    status: 'shipping',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(mockOrderService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', () => {
    expect(controller.create(mockOrder)).toEqual({
      user: 'some user',
      products: ['product1', 'product2'],
      total: 50,
      status: 'delivered',
    });
  });

  it('should return all orders', () => {
    expect(controller.findAll()).toEqual([mockOrder, mockOrder]);
  });

  it('should return one order by id', () => {
    expect(controller.findOne('1')).toEqual({
      user: 'some user',
      products: ['product1', 'product2'],
      total: 50,
      status: 'delivered',
      id: '1',
    });
  });

  it('should update an order', () => {
    expect(controller.update('1', mockUpdateOrder)).toEqual({
      status: 'shipping',
      id: '1',
    });
  });

  it('should remove an order', () => {
    expect(controller.remove('1')).toEqual({
      message: 'Order deleted',
      order: {
        user: 'some user',
        products: ['product1', 'product2'],
        total: 50,
        status: 'delivered',
        id: '1',
      },
    });
  });
});
