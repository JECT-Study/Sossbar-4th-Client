const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-0 w-full">
      <header className="mx-auto flex h-[136px] w-full max-w-[1000px] flex-col justify-center px-6 md:px-8">
        <h1 className="text-heading-2xl text-center font-bold tracking-tight text-(--color-text-basic)">
          개인정보처리방침
        </h1>
      </header>
      <hr className="border-t border-gray-200" />
      <div className="mx-auto w-full max-w-[1000px] px-6 pt-3 pb-10 md:px-8 md:pt-4 md:pb-10">
        <main className="mx-auto mt-7 max-w-[940px] text-(--color-text-basic)">
          <p className="text-body-md leading-8 text-(--color-text-secondary)">
            Sossbar(이하 ‘회사’)는 이용자의 개인정보를 중요시하며, ‘개인정보 보호법’ 등 관련 법령을 준수하고 있습니다.
            회사는 개인정보처리방침을 통해 이용자가 제공한 개인정보가 어떤 용도와 방식으로 이용되고 있으며, 개인정보
            보호를 위해 어떤 조치가 취해지고 있는지 알려드립니다.
          </p>

          <div className="text-body-md mt-6 space-y-10 leading-8 text-(--color-text-secondary)">
            <section>
              <h2 className="text-heading-base font-bold text-(--color-text-basic)">1. 수집하는 개인정보 항목</h2>
              <p className="mt-3">
                회사는 회원가입, 상담, 서비스 신청 등 필요 시 다음과 같은 개인정보를 수집할 수 있습니다.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>필수항목: 이름, 이메일, 비밀번호</li>
                <li>선택항목: 프로필 이미지, 연락처, 주소 등</li>
                <li>서비스 이용 과정에서 자동 수집되는 정보: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 기기정보</li>
              </ul>
            </section>

            <section>
              <h2 className="text-heading-base font-bold text-(--color-text-basic)">2. 개인정보 수집 및 이용 목적</h2>
              <p className="mt-3">회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>서비스 제공 및 회원 관리</li>
                <li>문의 및 요청사항 처리</li>
                <li>마케팅 및 광고 활용 (동의한 경우에 한함)</li>
                <li>서비스 이용 통계 분석 및 개선</li>
              </ul>
            </section>

            <section>
              <h2 className="text-heading-base font-bold text-(--color-text-basic)">3. 개인정보 보유 및 이용기간</h2>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>회원 탈퇴 시 또는 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</li>
                <li>
                  단, 관계 법령에 따라 보존할 필요가 있는 경우 일정 기간 보관할 수 있습니다.
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    <li>전자상거래 등에서의 소비자 보호에 관한 법률</li>
                    <ul className="mt-1 list-disc space-y-1 pl-6">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                      <li>대금 결제 및 재화 등의 공급에 대한 기록: 5년</li>
                      <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    </ul>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-heading-base font-bold text-(--color-text-basic)">4. 개인정보 제3자 제공</h2>
              <p className="mt-3">
                회사는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사기관의 요청이 있는 경우</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
