import { Contact } from "../models/contact.js";

const contactsData = [
  {
    name: "Ahmet Yılmaz",
    phoneNumber: "+905551234567",
    email: "ahmet.yilmaz@example.com",
    isFavourite: true,
    contactType: "work",
  },
  {
    name: "Elif Demir",
    phoneNumber: "+905538765432",
    email: "elif.demir@example.com",
    isFavourite: false,
    contactType: "home",
  },
  {
    name: "Mert Kaya",
    phoneNumber: "+905532112233",
    email: "mert.kaya@example.com",
    isFavourite: false,
    contactType: "personal",
  },
];

export const seedContacts = async () => {
  await Contact.deleteMany();
  await Contact.insertMany(contactsData);
  console.log("Contacts seeded successfully!");
};
