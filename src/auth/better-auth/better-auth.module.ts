import { Module } from '@nestjs/common';
import { auth } from './better-auth.config';

@Module({
  providers: [
    {
      provide: 'BETTER_AUTH',
      useValue: auth,
    },
  ],
  exports: ['BETTER_AUTH'],
})
export class BetterAuthModule {}