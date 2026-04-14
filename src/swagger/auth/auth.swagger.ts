import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { composeClass, composeMethod } from '../common/compose';
import { AUTH_SWAGGER_TAG } from './tag.constants';

export const ApiAuthControllerDocs = () =>
  composeClass(ApiTags(AUTH_SWAGGER_TAG));

export const ApiLoginDocs = () =>
  composeMethod(
    ApiOperation({ summary: '스토어 로그인 (authCode → JWT)' }),
  );
