import {
  Body,
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
import { GetHomesSerializer } from './serializers/getHomes.serializer';
import { HomeService } from './home.service';
import { GetHomesDto } from './dtos/getHome.dto';
import { createHomeDto } from './dtos/createHome.dto';
import { GetHomeSerializer } from './serializers/getHome.serializer';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  async getHomes(@Query() filters: GetHomesDto): Promise<GetHomesSerializer[]> {
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  async getHome(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetHomeSerializer> {
    return this.homeService.getHome(id);
  }

  @Post()
  async createHome(@Body() body: createHomeDto) {
    return this.homeService.createHome(body);
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
