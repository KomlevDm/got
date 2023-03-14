import {Module} from '@nestjs/common';

import {VsGameModule} from './vs-game/vs-game.module';

@Module({
  imports: [VsGameModule],
})
export class AppModule {}
