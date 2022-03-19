import { HomeBaseSerializer } from './homeBase.serializer';
export class UpdateHomeSerializer extends HomeBaseSerializer {
  constructor(partial: Partial<UpdateHomeSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
