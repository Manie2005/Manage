import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";

// Load environment variables from .env file
config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres', // Changed from 'postgres' to 'mysql'
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [join(__dirname, '/**/*.entity{.ts,.js}')], // Adjust path if needed
    migrations: [join(__dirname, '/migrations/*.js')],
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });
export default dataSource;
