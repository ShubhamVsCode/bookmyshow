"use client";

import ContactApi from "@/api/contact";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useContactStore from "@/store/contacts";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function AddContactDialog() {
  const [email, setEmail] = useState("");
  const { setContacts } = useContactStore();

  const handleAddContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    try {
      const response = await ContactApi.addContact({ email });
      setContacts(response.data.contacts);

      if (response.success) {
        toast.success("Contact added successfully");
        setEmail("");
      } else {
        toast.error(response.message || "Failed to add contact");
      }
    } catch (error: any) {
      toast.error(error.error || "Failed to add contact");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-7 my-4">
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddContact}>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>
              Enter email of the contact you want to add
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="Enter email"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
