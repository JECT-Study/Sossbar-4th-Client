import { redirect } from 'next/navigation';

const LegacyPersonalRedirect = () => {
  redirect('/policies/privacy-policy');
};

export default LegacyPersonalRedirect;
