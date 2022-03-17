import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  async getHomes() {
    return this.homeService.getHomes();
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
