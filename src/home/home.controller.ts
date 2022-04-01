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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { createHomeDto, GetHomesDto, inquireDto } from './dto';
import {
  CreateHomeSerializer,
  GetHomeSerializer,
  GetHomesSerializer,
  UpdateHomeSerializer,
} from './serializer';
import { UpdateHomeDto } from './dto/updateHome.dto';
import { User, UserRequestType } from 'src/auth/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.dectorator';
import { UserType } from '@prisma/client';

@ApiTags('home')
@ApiBearerAuth('Authorization')
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

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  async createHome(
    @Body() body: createHomeDto,
    @User() user: UserRequestType,
  ): Promise<CreateHomeSerializer> {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserRequestType,
  ): Promise<UpdateHomeSerializer> {
    const realtorId = await this.homeService.getRealtorByHomeId(id);
    if (realtorId !== user.id) throw new UnauthorizedException();

    return this.homeService.updateHome(id, body);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserRequestType,
  ) {
    const realtorId = await this.homeService.getRealtorByHomeId(id);
    if (realtorId !== user.id) throw new UnauthorizedException();

    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post(':id/inquire')
  async inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserRequestType,
    @Body() { message }: inquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get(':id/message')
  async getHomeMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserRequestType,
  ) {
    const realtorId = await this.homeService.getRealtorByHomeId(homeId);
    if (realtorId !== user.id) throw new UnauthorizedException();

    return this.homeService.getMessagesByHome(homeId);
  }
}
