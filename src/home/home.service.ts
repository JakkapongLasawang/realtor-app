import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createHomeDto } from './dtos/createHome.dto';
import { GetHomesDto } from './dtos/getHome.dto';
import { HomeSerializer } from './serializers/home.serializer';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(payload: GetHomesDto): Promise<HomeSerializer[]> {
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
      return new HomeSerializer(fetchHome);
    });
  }

  async getHome(id: number): Promise<HomeSerializer> {
    const home = await this.prismaService.home.findUnique({
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
        },
      },
      where: { id },
    });

    if (!home) throw new NotFoundException();

    const images = home.Image;
    delete home.Image;
    const fetchHome = { ...home, images };

    return new HomeSerializer(fetchHome);
  }

  async createHome(payload: createHomeDto) {
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
        realtor_id: 1,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return new HomeSerializer(home);
  }

  async updateHome() {
    return [];
  }

  async deleteHome() {
    return [];
  }

  // private section
  private filtersHome({ city, maxPrice, minPrice, propertyType }: GetHomesDto) {
    // dynamic json
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { gte: Number(maxPrice) }),
          }
        : undefined;

    return {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
  }
}
