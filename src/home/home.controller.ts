import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeResponseDto } from './responses/homeResponse.dto';
import { HomeService } from './home.service';
import { GetHomesDto } from './dtos/getHomes.dto';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  async getHomes(
    @Query() { city, maxPrice, minPrice, propertyType }: GetHomesDto,
  ): Promise<HomeResponseDto[]> {
    // dynamic json
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { gte: Number(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  async getHome() {
    return this.homeService.getHome();
  }

  @Post()
  async createHome() {
    return this.homeService.createHome();
  }
  @Put(':id')
  async updateHome() {
    return this.homeService.updateHome();
  }
  @Delete(':id')
  async deleteHome() {
    return this.homeService.deleteHome();
  }
}
