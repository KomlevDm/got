import {Module} from '@nestjs/common';

import {VsGameGateway} from './vs-game.gateway';

@Module({
  providers: [VsGameGateway],
})
export class VsGameModule {}
