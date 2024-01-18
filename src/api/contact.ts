import { IContact } from "@/types/contact";
import { get, post } from "./index";

interface ContactResponse {
  data: {
    contacts: IContact[];
  };
  message: string;
  success: boolean;
}

class ContactApi {
  static async getAllContacts(): Promise<ContactResponse> {
    return get("/contact/all");
  }

  static async addContact(data: { email: string }): Promise<ContactResponse> {
    return post("/contact/add", data);
  }
}

export default ContactApi;
