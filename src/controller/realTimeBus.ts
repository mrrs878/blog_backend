/*
* @Author: mrrs878@foxmail.com
* @Date: 2021-03-19 10:02:41
 * @LastEditTime: 2021-03-19 13:14:46
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /blog_backend/src/controller/realTimeBus.ts
*/
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import RealTimeBusService from 'src/service/realTimeBus';

@Controller('/realTimeBus')
@ApiTags('实时公交模块')
export default class RealTimeBusController {
  constructor(private readonly realTimeBusService: RealTimeBusService) {
  }

  @Get('/busBase/:name')
  getBusBase(@Param('name') name: string) {
    return this.realTimeBusService.getBusBase(name);
  }

  @Get('/busStop/:name/:lineId')
  getBusStops(@Param('name') name: string, @Param('lineId') lineid: string) {
    return this.realTimeBusService.getBusStops({ name, lineid });
  }

  @Get('/arriveBase/:name/:lineId/:stopId/:direction')
  getArriveBase(
  @Param('name') name: string,
    @Param('lineId') lineid: string,
    @Param('stopId') stopid: string,
    @Param('direction') direction: number,
  ) {
    return this.realTimeBusService.getArriveBase({ name, lineid, stopid, direction });
  }
}
