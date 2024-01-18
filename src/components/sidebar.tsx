"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AddContactDialog } from "./add-contact";
import useContactStore from "@/store/contacts";
import ContactApi from "@/api/contact";
import { useEffect } from "react";
import useSocket from "@/hooks/useSocket";

const Sidebar = () => {
  const { contacts, setContacts } = useContactStore();
  const { messageCountPerUser } = useSocket();

  const getContacts = async () => {
    const { data } = await ContactApi.getAllContacts();
    setContacts(data.contacts);
  };

  useEffect(() => {
    getContacts();
  }, []);

  console.log(messageCountPerUser);

  return (
    <div className="flex flex-col w-80 border-r border-slate-900 bg-white dark:bg-black">
      <aside className="flex-1 overflow-y-auto">
        <nav className="space-y-1 p-4">
          {contacts.map((contact) => {
            return (
              <Link
                key={contact._id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                href={`/chat/${contact._id}`}
              >
                <Avatar className="w-10 h-10 border">
                  <AvatarImage alt={contact.name} src="/placeholder-user.jpg" />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium line-clamp-1">
                    {contact.name}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-1 dark:text-slate-400">
                    {contact.email}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-1 dark:text-slate-400">
                    {messageCountPerUser[contact._id] || 0} new messages
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
      <AddContactDialog />
    </div>
  );
};

export default Sidebar;
