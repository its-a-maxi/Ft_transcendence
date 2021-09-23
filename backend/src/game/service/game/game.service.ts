import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/game/models/game.entity';
import { GameI } from 'src/game/models/game.interface';
import { Repository } from 'typeorm';

@Injectable()
export class GameService
{
	constructor(@InjectRepository(GameEntity)
				private readonly gameRepository: Repository<GameEntity>) {}

	async create(game: GameI)
    {
        return await this.gameRepository.save(game)
    }

    async delete(roomId: number)
    {
        await this.gameRepository.delete(roomId)
    }

    async deleteAll()
    {
        await this.gameRepository
          .createQueryBuilder()
          .delete()
          .execute();
    }
}
