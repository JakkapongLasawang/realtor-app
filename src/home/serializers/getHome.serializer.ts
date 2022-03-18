import { HomeBaseSerializer } from './hoemBase.serializer';
export class GetHomeSerializer extends HomeBaseSerializer {
  constructor(partial: Partial<GetHomeSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
