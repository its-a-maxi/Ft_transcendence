import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "ft_transcendence",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
}