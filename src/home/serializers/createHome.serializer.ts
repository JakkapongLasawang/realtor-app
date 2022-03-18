import { Exclude, Expose } from 'class-transformer';
import { HomeBaseSerializer } from './hoemBase.serializer';
export class CreateHomeSerializer extends HomeBaseSerializer {
  @Exclude()
  created_at: Date;
  @Expose({ name: 'createdAt' })
  createdAt() {
    return this.created_at;
  }

  @Exclude()
  update_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<CreateHomeSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
