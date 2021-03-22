/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-19 10:03:01
 * @LastEditTime: 2021-03-22 22:25:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blog_backend/src/service/realTimeBus.ts
 */
import { Injectable } from '@nestjs/common';
import { isEmptyObject, obj2QueryString } from 'src/tool';
import axios, { AxiosResponse } from 'axios';
import CacheService from './cache';

@Injectable()
export default class RealTimeBusService {
  constructor(
    private readonly cacheService: CacheService,
  ) {
  }

  async getBusBase(name: string): Promise<Res<IGetBusBaseRes>> {
    try {
      const data = await this.cacheService.get(`${name}:busBase`);
      if (!isEmptyObject(data)) {
        return {
          success: true,
          code: 0,
          msg: '获取成功',
          data,
        };
      }
      const params = { name: encodeURIComponent(name) };
      const busBase = await axios.get<IGetBusBaseReq, AxiosResponse<IGetBusBaseRes>>(`https://apps.eshimin.com/traffic/gjc/getBusBase?${obj2QueryString(params)}`);
      if (busBase.data.line_name !== name || busBase.status !== 200) {
        return {
          success: false,
          code: -1,
          msg: '线路不存在',
        };
      }
      await this.cacheService.set(`${name}:busBase`, busBase.data, 60 * 60 * 24 * 30);
      return {
        success: true,
        code: 0,
        msg: '获取成功',
        data: busBase.data,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        code: -1,
        msg: e.message,
      };
    }
  }

  async getBusStops(param: IGetBusStopsReq): Promise<Res<IGetBusStopsRes>> {
    try {
      const data = await this.cacheService.get(`${param.name}:busStops`);
      if (!isEmptyObject(data)) {
        return {
          success: true,
          code: 0,
          msg: '获取成功',
          data,
        };
      }
      console.log('reGet');
      const params: IGetBusStopsReq = { ...param, name: encodeURIComponent(param.name) };
      const url = `https://apps.eshimin.com/traffic/gjc/getBusStop?${obj2QueryString(params)}`;
      const busStop = await axios.get<IGetBusStopsReq, AxiosResponse<IGetBusStopsRes>>(url);
      if (!busStop.data.lineResults0 || busStop.status !== 200) {
        return {
          success: false,
          code: -1,
          msg: '线路不存在',
        };
      }
      await this.cacheService.set(`${param.name}:busStops`, busStop.data, 60);
      return {
        success: true,
        code: 0,
        msg: '获取成功',
        data: busStop.data,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        code: -1,
        msg: e.message,
      };
    }
  }

  async getArriveBase(param: IGetArriveBaseReq) {
    try {
      const data = await this.cacheService.get(`${param.stopid}@${param.lineid}@${param.direction}:ArriveBase`);
      console.log(data);
      if (!isEmptyObject(data)) {
        return {
          success: true,
          code: 0,
          msg: '获取成功',
          data,
        };
      }
      const params: IGetArriveBaseReq = { ...param, name: encodeURIComponent(param.name) };
      console.log(params);
      const url = `https://apps.eshimin.com/traffic/gjc/getArriveBase?${obj2QueryString(params)}`;
      const arrivalBase = await axios.get<IGetArriveBaseReq, AxiosResponse<IGetArriveBaseRes>>(url);
      console.log(arrivalBase.data?.cars);
      if (isEmptyObject(arrivalBase.data?.cars) || arrivalBase.status !== 200) {
        return {
          success: false,
          code: -1,
          msg: '获取到站信息失败',
        };
      }
      await this.cacheService.set(`${param.stopid}@${param.lineid}@${param.direction}:ArriveBase`, arrivalBase.data, 1000 * 30);
      return {
        success: true,
        code: 0,
        msg: '获取成功',
        data: arrivalBase.data,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        code: -1,
        msg: e.message,
      };
    }
  }
}
