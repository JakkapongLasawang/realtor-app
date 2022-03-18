import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHomesDto } from './dtos/getHomes.dto';
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

    const images = home.Image.map((image) => image.url);
    delete home.Image;
    const fetchHome = { ...home, images };

    return new HomeSerializer(fetchHome);
  }

  async createHome() {
    return [];
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
