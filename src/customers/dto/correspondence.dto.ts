export class CorrespondentCreateDTO {
  readonly title: string;
  readonly phoneNumber: string;
  readonly address: string;
  readonly notes?: string;
}

export class CorrespondentUpdateDTO {
  readonly title?: string;
  readonly phonNumber?: string;
  readonly address?: string;
  readonly notes?: string;
}
