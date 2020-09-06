export enum CustomerStatus {
  normal = 'normal',
  blocked = 'blocked',
}

export type Correspondent = {
  correspondentId: string;
  title?: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;

  createdTime?: Date;
  lastUpdatedTime?: Date;
}

export type Customer = {
  customerId: string;
  customerName: string;
  contactPhoneNumber: string;
  customerIdNumber: string;
  customerBirthdate: string;

  correspondence?: Correspondent[];

  latestStatus?: CustomerStatus;

  createdTime?: Date;
  normalTime?: Date;
  blockedTime?: Date;
}
