import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeSerializer } from './serializers/home.serializer';
import { HomeService } from './home.service';
import { GetHomesDto } from './dtos/getHomes.dto';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  async getHomes(@Query() filters: GetHomesDto): Promise<HomeSerializer[]> {
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  async getHome(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HomeSerializer> {
    return this.homeService.getHome(id);
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
