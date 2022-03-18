import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
export class HomeSerializer {
  id: number;
  address: string;
  city: string;
  price: number;

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

  constructor(partial: Partial<HomeSerializer>) {
    Object.assign(this, partial);
  }
}
