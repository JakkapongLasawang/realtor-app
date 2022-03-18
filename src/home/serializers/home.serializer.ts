import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
export class HomeSerializer {
  id: number;
  address: string;
  city: string;
  price: number;

  @Exclude()
  realtor_id?: number;

  @Exclude()
  created_at?: Date;
  @Exclude()
  updated_at?: Date;

  @Exclude()
  land_size?: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  property_type: PropertyType;
  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedroom' })
  numberOfBedroom() {
    return this.number_of_bedrooms;
  }
  image?: string;

  images?: { url: string }[];

  constructor(partial: Partial<HomeSerializer>) {
    Object.assign(this, partial);
  }
}
