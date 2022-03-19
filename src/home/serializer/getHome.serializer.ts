import { HomeBaseSerializer } from './homeBase.serializer';
export class GetHomeSerializer extends HomeBaseSerializer {
  constructor(partial: Partial<GetHomeSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
