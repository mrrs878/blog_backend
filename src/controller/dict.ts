/*
 * @Author: mrrs878
 * @Date: 2020-09-29 14:48:46
 * @LastEditTime: 2020-10-16 12:52:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\article.ts
 */
import { Controller, Get, Param, Put, Body, Post, UseInterceptors, Delete, UsePipes, UseGuards, CacheInterceptor, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { GetDictRes, GetDicts, UpdateDictRes, DeleteDictRes } from 'src/swagger/res';
import { UpdateDictDto, CreateDictDto } from 'src/swagger/dto';
import { addDictV } from 'src/pipes/JoiValidationPipe';
import { Dict } from 'src/models/dict';
import { AuthGuard } from '@nestjs/passport';
import MAIN_CONFIG from 'src/config';
import { RBACGuard } from 'src/guards/auth';
import DictService from 'src/service/dict';

@Controller('/dict')
@ApiTags('字典管理模块')
export default class DictController {
  constructor(private readonly dictService: DictService) {}

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  @ApiOperation({ description: '获取所有字段', summary: '获取所有字段' })
  @ApiOkResponse({ status: 200, type: GetDicts })
  getAllDicts() {
    return this.dictService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ description: '查询单个字段', summary: '查询单个字段' })
  @ApiParam({ name: 'id', description: '字段id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetDictRes })
  getDict(@Param() params: { id: string }) {
    return this.dictService.findOneById(params.id);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @ApiOperation({ description: '更新字段', summary: '更新字段' })
  @ApiParam({ name: 'id', description: '字段id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiBody({ description: '字段', type: UpdateDictDto })
  @ApiOkResponse({ status: 200, type: UpdateDictRes })
  updateDict(@Param() params, @Body() body, @Req() req) {
    return this.dictService.updateDictById({ ...body, _id: params.id }, req);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @ApiOperation({ description: '创建字段', summary: '创建字段' })
  @ApiBody({ description: '字段', type: CreateDictDto })
  @ApiOkResponse({ status: 200, type: CreateDictDto })
  @UsePipes(addDictV)
  createDict(@Body() body:Dict, @Req() req) {
    return this.dictService.createDict(body, req);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiOperation({ description: '删除字段', summary: '删除字段' })
  @ApiParam({ name: 'id', description: '字段id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: DeleteDictRes })
  deleteDict(@Param() params, @Req() req) {
    return this.dictService.deleteDict(params.id, req);
  }
}
