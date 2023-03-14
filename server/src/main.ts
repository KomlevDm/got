import {NestFactory} from '@nestjs/core';

import {AppModule} from './app.module';

void (async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);

  console.warn('Server is running on: http://localhost:3000');
})();
