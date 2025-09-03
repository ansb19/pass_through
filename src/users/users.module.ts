import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDevicesController } from './user_devices.controller';
import { UserDevicesService } from './user_devices.service';
import { UserDevice } from './entities/user_device.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CryptoModule } from 'src/common/crypto/crypto.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDevice]),
    forwardRef(() => AuthModule),  // ✅ 순환 참조 해결
    CryptoModule
  ],
  controllers: [UsersController, UserDevicesController],
  providers: [UsersService, UserDevicesService],
  exports: [UsersService, UserDevicesService],
})
export class UsersModule {

}
