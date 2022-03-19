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
import { HomeService } from './home.service';
import { createHomeDto, GetHomesDto } from './dto';
import {
  CreateHomeSerializer,
  GetHomeSerializer,
  GetHomesSerializer,
  UpdateHomeSerializer,
} from './serializer';
import { UpdateHomeDto } from './dto/updateHome.dto';

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
  async createHome(@Body() body: createHomeDto): Promise<CreateHomeSerializer> {
    return this.homeService.createHome(body);
  }
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
  ): Promise<UpdateHomeSerializer> {
    return this.homeService.updateHome(id, body);
  }
  @Delete(':id')
  async deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
