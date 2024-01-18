import { IContact } from "@/types/contact";
import { create } from "zustand";

interface ContactState {
  contacts: IContact[];
}

interface ContactActions extends ContactState {
  setContacts: (newContacts: IContact[]) => void;
}

const useContactStore = create<ContactState & ContactActions>((set) => ({
  contacts: [],
  setContacts: (newContacts) => set({ contacts: newContacts }),
}));

export default useContactStore;
