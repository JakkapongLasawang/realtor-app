import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes() {
    return await this.prismaService.home.findMany();
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
