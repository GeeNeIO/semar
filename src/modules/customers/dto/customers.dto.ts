export class CustomerCreateDTO {
  readonly customerName: string;
  readonly contactPhoneNumber: string;
  readonly customerIdNumber?: string;
  readonly customerBirthdate?: string;
}

export class CustomerUpdateDTO {
  readonly customerName?: string;
  readonly contactPhoneNumber?: string;
  readonly customerIdNumber?: string;
  readonly customerBirthdate?: string;
}
