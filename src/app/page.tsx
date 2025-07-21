import { redirect } from 'next/navigation';

export default async function Page() {
  console.log('Redirecting to /dashboard/vacancies');
  redirect('/dashboard/vacancies');
}
