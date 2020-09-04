import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MAIN_CONFIG from '../config';

@Module({
  imports: [
    MongooseModule.forRoot(MAIN_CONFIG.db, { useFindAndModify: false }),
  ],
})
export default class DB {}
