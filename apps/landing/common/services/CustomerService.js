import pRetry, { AbortError } from "p-retry";

const headers = new Headers();
headers.set("Content-Type", "application/json");

/**
 * Registers a new customer with the given information.
 * @async
 * @param {Object} payload - The data of the customer to be registered.
 * @param {string} payload.email - The email address of the customer.
 * @param {string} payload.firstName - The first name of the customer.
 * @param {string} payload.lastName - The last name of the customer.
 * @param {string} payload.phone - The phone number of the customer.
 * @param {boolean} payload.isBrazilian - Indicates whether the customer is Brazilian or not.
 * @returns {Promise<""|"alreadyRegistered"|"registered">} A Promise that resolves when the customer is successfully registered.
 */
export async function registerCustomer(payload) {
  return pRetry(
    async () => {
      const response = await fetch("/api/customer", {
        body: JSON.stringify(payload),
        method: "POST",
        headers,
      });

      if (response.ok) {
        const { status } = await response.json();
        return status;
      }
      throw new AbortError("Registration Failure");
    },
    {
      retries: 3,
    }
  );
}
