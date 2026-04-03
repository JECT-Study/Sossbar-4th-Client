import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { href: '#', label: '기능' },
  { href: '#', label: '이용방법' },
  { href: '#', label: '데모 프로필' },
] as const;

export const Header = () => {
  return (
    <header className="bg-gray-0/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <Link href="/" className="relative flex h-[36px] shrink-0 items-center">
          <Image src="/Sossbar_logo.svg" alt="Sossbar" width={161} height={36} className="h-[36px] w-auto" priority />
        </Link>

        <div className="flex min-w-0 items-center gap-4">
          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-4">
              {navItems.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-body-base inline-flex rounded-lg px-2 py-2 whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:px-3"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/login"
            className="bg-button-primary-fill text-body-base text-button-text-fill hover:bg-button-primary-fill-hover active:bg-button-primary-fill-pressed flex h-[40px] w-[90px] shrink-0 items-center justify-center rounded-lg text-center leading-none font-medium transition-colors"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
};
