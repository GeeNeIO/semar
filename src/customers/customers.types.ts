export enum CustomerStatus {
  normal = 'normal',
  blocked = 'blocked',
}

export enum CustomerType {
  agent = 'agent',
  normal = 'normal',
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
  customerName?: string;
  contactPhoneNumber?: string;

  correspondence?: Correspondent[];

  customerType?: CustomerType;
  latestStatus?: CustomerStatus;

  createdTime?: Date;
  normalTime?: Date;
  blockedTime?: Date;
}
