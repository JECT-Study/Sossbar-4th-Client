import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const MODAL_QUERY_KEY = 'modal';
const LOGIN_MODAL_VALUE = 'login';

export const useLoginModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get(MODAL_QUERY_KEY) === LOGIN_MODAL_VALUE;

  const onOpenChange = (nextOpen: boolean) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextOpen) {
      nextParams.set(MODAL_QUERY_KEY, LOGIN_MODAL_VALUE);
      router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
      return;
    }

    nextParams.delete(MODAL_QUERY_KEY);
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const openLoginModal = () => onOpenChange(true);

  return { isOpen, onOpenChange, openLoginModal };
};
