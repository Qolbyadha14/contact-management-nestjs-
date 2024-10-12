export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string
  phone_number?: string
}

export class CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string
  phone_number?: string
}