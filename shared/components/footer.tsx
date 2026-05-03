import Link from 'next/link';

const footerLinks = [
  { href: '#', label: '회사 소개' },
  { href: '#', label: '문의하기' },
  { href: '#', label: '커뮤니티' },
  { href: '#', label: '개인정보 처리방침' },
  { href: '#', label: '이용약관' },
] as const;

export const Footer = () => {
  return (
    <footer className="mt-auto bg-black">
      <div className="mx-auto flex min-h-[167px] w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-0">
        <nav aria-label="푸터 링크">
          <ul className="flex flex-wrap items-center gap-6">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-body-sm text-gray-0 transition-opacity hover:opacity-80">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-body-xs shrink-0 text-gray-400 md:text-right">© 2026 Sossbar All rights reserved.</p>
      </div>
    </footer>
  );
};
