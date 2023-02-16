import { type ActionArgs } from "@remix-run/node";
import { redirect } from "react-router";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  console.log(body);
  return redirect(`/home`);
}
