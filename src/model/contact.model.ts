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

export class UpdateContactRequest {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string
  phone_number?: string
}

export class SearchContactRequest {
  name?: string;
  email?: string;
  phone_number?: string;
  page?: number;
  size?: number
}