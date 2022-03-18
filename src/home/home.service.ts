import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHomesDto } from './dtos/getHomes.dto';
import { HomeResponse } from './responses/homeResponse.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(payload: GetHomesDto): Promise<HomeResponse[]> {
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
      return new HomeResponse(fetchHome);
    });
  }

  async getHome() {
    return [];
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
