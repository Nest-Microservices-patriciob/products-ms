import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({
      where: { isAvailable: true },
    });
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        where: { isAvailable: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        totalProducts,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, isAvailable: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id ${id} was not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id); //Se puede optimizar con try/catch

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        isAvailable: false,
      },
    });

    return product;
  }
}
