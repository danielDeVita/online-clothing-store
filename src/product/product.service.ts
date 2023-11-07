import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const uploadedImage = await this.uploadToCloudinary(file);

    const newProduct = await this.productModel.create({
      image: uploadedImage.secure_url,
      ...createProductDto,
    });
    return newProduct.save();
  }

  async findAll(size?: string) {
    if (size) {
      return await this.productModel
        .find({
          $text: { $search: size, $caseSensitive: true, $language: 'en' },
        })
        .populate('category', { _id: 0, __v: 0 });
    } else return await this.productModel.find().populate('category', { _id: 0, __v: 0 });
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('category', { _id: 0, __v: 0 });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File) {
    let uploadedImage;
    if (file) {
      uploadedImage = await this.uploadToCloudinary(file);
    } else {
      let foundProduct = await this.findOne(id);
      uploadedImage = foundProduct.image;
    }

    const product = await this.productModel.findByIdAndUpdate(
      id,
      {
        image: uploadedImage.secure_url,
        ...updateProductDto,
      },
      { new: true },
    );

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return { message: 'Product deleted', product };
  }

  async uploadToCloudinary(file: Express.Multer.File) {
    return await this.cloudinaryService.uploadFile(file);
  }
}
