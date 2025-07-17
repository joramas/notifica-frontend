import type { Customer } from "./model_types";

const BASE_URL = import.meta.env.VITE_NOTIFICA_BACKEND_WEB_SERVICE_URL;

export async function FetchCustomers(user_id: string): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/customers/by-user?userId=${user_id}`, {
    credentials: "include",
  });

  console.log(`BaseUrl: ${BASE_URL}\nTestUserId: ${user_id}`);

  if (!res.ok) {
    throw new Error("Error fetching customers");
  }

  return res.json();
}

export async function CreateCustomer(data: {
  userId: string;
  name: string;
  phone: string;
  email?: string | null;
}) {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(`Sending customer payload: ${JSON.stringify(data, null, 2)}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("CreateCustomer failed:", res.status, res.statusText, text);
    throw new Error("Failed to create customer");
  }

  return res.json();
}
