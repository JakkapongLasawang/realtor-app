import { Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UserRequestType } from 'src/auth/decorators/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHomesDto, createHomeDto } from './dto';
import { UpdateHomeDto } from './dto/updateHome.dto';
import {
  CreateHomeSerializer,
  GetHomeSerializer,
  GetHomesSerializer,
  UpdateHomeSerializer,
} from './serializer';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(payload: GetHomesDto): Promise<GetHomesSerializer[]> {
    const filters = this.filtersHome(payload);

    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        Image: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });

    if (!homes.length) throw new NotFoundException();

    return homes.map((home) => {
      const image = home.Image[0].url;
      const fetchHome = { ...home, image };
      delete fetchHome.Image;
      return new GetHomesSerializer(fetchHome);
    });
  }

  async getHome(id: number): Promise<GetHomeSerializer> {
    const home = await this.prismaService.home.findUnique({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        created_at: true,
        updated_at: true,
        Image: {
          select: {
            url: true,
            id: true,
          },
        },
      },
      where: { id },
    });

    if (!home) throw new NotFoundException();

    const images = home.Image;
    delete home.Image;
    const fetchHome = { ...home, images };

    return new GetHomeSerializer(fetchHome);
  }

  async createHome(
    payload: createHomeDto,
    userId: number,
  ): Promise<CreateHomeSerializer> {
    const {
      address,
      city,
      images,
      landSize,
      numberOfBathrooms,
      numberOfBedrooms,
      price,
      propertyType,
    } = payload;

    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        price,
        property_type: propertyType,
        realtor_id: userId,
      },
    });
    console.log(images);
    const homeImages = images.map((url) => {
      return { url, home_id: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return new CreateHomeSerializer(home);
  }

  async updateHome(
    id: number,
    payload: UpdateHomeDto,
  ): Promise<UpdateHomeSerializer> {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) throw new NotFoundException();

    const updateData = this.dataUpdateHome(payload);

    const homeUpdated = await this.prismaService.home.update({
      where: { id },
      data: updateData,
    });

    return new UpdateHomeSerializer(homeUpdated);
  }

  async deleteHome(id: number) {
    await this.prismaService.image.deleteMany({
      where: { home_id: id },
    });
    await this.prismaService.home.delete({ where: { id } });

    return { success: true };
  }

  async inquire(user: UserRequestType, homeId: number, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId);
    return await this.prismaService.message.create({
      data: {
        realtor_id: realtor,
        buyer_id: user.id,
        home_id: homeId,
        message,
      },
    });
  }
  async getMessagesByHome(homeId: number) {
    return await this.prismaService.message.findMany({
      select: {
        buyer: {
          select: {
            name: true,
            phone: true,
          },
        },
        message: true,
        updated_at: true,
      },
      where: {
        home_id: homeId,
      },
    });
  }

  // private section
  private filtersHome({ city, maxPrice, minPrice, propertyType }: GetHomesDto) {
    // dynamic json
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice !== undefined && { gte: Number(minPrice) }),
            ...(maxPrice !== undefined && { gte: Number(maxPrice) }),
          }
        : undefined;

    return {
      ...(city && { city }),
      ...(price !== undefined && { price }),
      ...(propertyType && { property_type: propertyType }),
    };
  }

  private dataUpdateHome(data: UpdateHomeDto) {
    const {
      address,
      city,
      landSize,
      numberOfBathrooms,
      numberOfBedrooms,
      price,
      propertyType,
    } = data;
    return {
      ...(address && { address }),
      ...(city && { city }),
      ...(price !== undefined && { price }),
      ...(propertyType && { property_type: propertyType }),
      ...(landSize && { land_size: landSize }),
      ...(numberOfBathrooms !== undefined && {
        number_of_bathrooms: numberOfBathrooms,
      }),
      ...(numberOfBedrooms !== undefined && {
        number_of_bedrooms: numberOfBedrooms,
      }),
    };
  }
  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      select: { realtor_id: true },
      where: { id },
    });

    if (!home) throw new NotFoundException();

    return home.realtor_id;
  }
}
