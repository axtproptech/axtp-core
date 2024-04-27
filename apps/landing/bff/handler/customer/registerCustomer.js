import { prisma } from "@axtp/db";
import cuid from "cuid";
import { string, object } from "yup";
import { sendNewLeadMails } from "./sendNewLeadMails";

const RegisterCustomerBody = object({
  email: string().required(),
  firstName: string().required(),
  lastName: string().required(),
});

export const registerCustomer = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, isBrazilian } =
      RegisterCustomerBody.validateSync(req.body);

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email1: email,
      },
    });

    if (existingCustomer) {
      res.status(200).json({ status: "alreadyRegistered" });
      return;
    }

    await prisma.customer.create({
      data: {
        cpfCnpj: `unverified-${cuid()}`, // needs to be unique
        firstName: firstName,
        lastName: lastName,
        email1: email,
        phone1: phone,
        verificationLevel: "NotVerified",
        isInBrazil: isBrazilian,
      },
    });

    await sendNewLeadMails({ email, firstName, lastName, phone, isBrazilian });

    res.status(201).json({ status: "registered" });
  } catch (e) {
    console.error("registerCustomer", e.message);
    res.status(500);
  }
};
