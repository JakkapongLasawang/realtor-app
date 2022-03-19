import { HomeBaseSerializer } from './homeBase.serializer';
import { Exclude, Expose } from 'class-transformer';
import { convertTime } from 'src/utils/times/convert.time';

export class GetHomeSerializer extends HomeBaseSerializer {
  @Exclude()
  created_at: Date;
  @Expose({ name: 'createdAt' })
  createdAt() {
    return convertTime(this.created_at);
  }

  @Exclude()
  updated_at: Date;
  @Expose({ name: 'updatedAt' })
  updatedAt() {
    return convertTime(this.updated_at);
  }
  constructor(partial: Partial<GetHomeSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
