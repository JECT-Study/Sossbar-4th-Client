import Image from 'next/image';
import Link from 'next/link';

export const HeaderLogoLink = () => {
  return (
    <Link href="/" className="flex h-10 w-[122px] shrink-0 items-center">
      <Image
        src="/Sossbar_logo.svg"
        alt="Sossbar"
        width={161}
        height={36}
        className="h-9 w-[122px] object-contain object-left"
        priority
      />
    </Link>
  );
};
