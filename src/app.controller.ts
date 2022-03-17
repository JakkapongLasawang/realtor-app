import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hello World')
@Controller()
export class AppController {
  @Get()
  getHello() {
    return (
      'Hello World - ' +
      new Date(Date.now()).toLocaleString('en-Us', {
        timeZone: 'Asia/Bangkok',
      })
    );
  }
}
