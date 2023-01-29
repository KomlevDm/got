import {IMonster} from './monster.interface';

export interface IMonsterService {
  create: () => IMonster;
}
