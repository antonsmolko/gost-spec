import { guard } from '@gost-kit/common';
import type { UserDto } from '../dto/user.ts';
import type { User } from '../../domain/entities/user.ts';

export const mapUser = (dto: UserDto): User => {
  if (!guard.record(dto) || !guard.string(dto.user_id) || !guard.string(dto.full_name)) {
    throw new Error('Invalid user DTO');
  }
  return { id: dto.user_id, name: dto.full_name };
};
