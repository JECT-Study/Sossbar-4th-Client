import { redirect } from 'next/navigation';

const LegacyTermsRedirect = () => {
  redirect('/policies/terms-of-service');
};

export default LegacyTermsRedirect;
