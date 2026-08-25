import { redirect } from 'next/navigation';

export default function PatientsRootPage() {
  redirect('/patients/dashboard');
}
