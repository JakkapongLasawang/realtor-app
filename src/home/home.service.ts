import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHomesDto } from './dtos/getHomes.dto';
import { HomeResponseDto } from './responses/homeResponse.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filters: GetHomesDto): Promise<HomeResponseDto[]> {
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

    return homes.map((home) => {
      const image = home.Image[0].url;
      const fetchHome = { ...home, image };
      delete fetchHome.Image;
      return new HomeResponseDto(fetchHome);
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
}
