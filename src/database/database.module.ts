import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'config/typeorm';

@Module({
    imports:[
        ConfigModule.forRoot({isGlobal:true}),
    
    TypeOrmModule.forRoot(dataSourceOptions)
],
})
export class DatabaseModule{}