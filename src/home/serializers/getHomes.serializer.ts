import { HomeBaseSerializer } from './hoemBase.serializer';
export class GetHomesSerializer extends HomeBaseSerializer {
  image: string;

  constructor(partial: Partial<GetHomesSerializer>) {
    super(partial);
    Object.assign(this, partial);
  }
}
