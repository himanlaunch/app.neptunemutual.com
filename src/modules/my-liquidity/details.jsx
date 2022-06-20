import { useRouter } from "next/router";
import { Container } from "@/common/Container/Container";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { ProvideLiquidityForm } from "@/common/LiquidityForms/ProvideLiquidityForm";
import { t, Trans } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useCovers } from "@/src/context/Covers";
import { LiquidityResolutionSources } from "@/common/LiquidityResolutionSources/LiquidityResolutionSources";
import { useCalculatePods } from "@/src/hooks/provide-liquidity/useCalculatePods";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { useVaultAddress } from "@/src/hooks/contracts/useVaultAddress";

export const MyLiquidityCoverPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const { getInfoByKey } = useCovers();
  const coverInfo = getInfoByKey(coverKey);
  const vaultTokenAddress = useVaultAddress({ coverKey });

  const { podBalance, vaultTokenDecimals } = useLiquidityFormsContext();

  const myLiquidity = useCalculatePods({
    coverKey,
    value: podBalance,
    podAddress: vaultTokenAddress,
  });

  const {
    info,
    refetch: refetchInfo,
    isWithdrawalWindowOpen,
    accrueInterest,
  } = useMyLiquidityInfo({
    coverKey,
  });

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const imgSrc = getCoverImgSrc({ key: coverKey });

  return (
    <div>
      <main className="bg-f1f3f6">
        {/* hero */}
        <Hero>
          <Container className="px-2 py-20">
            <BreadCrumbs
              pages={[
                {
                  name: t`My Liquidity`,
                  href: "/my-liquidity",
                  current: false,
                },
                { name: coverInfo.projectName, href: "#", current: true },
              ]}
            />
            <div className="flex">
              <CoverProfileInfo
                coverKey={coverKey}
                projectName={coverInfo?.coverName}
                links={coverInfo?.links}
                imgSrc={imgSrc}
              />

              {/* My Liquidity */}
              <HeroStat title={t`My Liquidity`}>
                {
                  formatCurrency(
                    convertFromUnits(
                      myLiquidity.receiveAmount,
                      vaultTokenDecimals
                    ),
                    router.locale
                  ).long
                }
              </HeroStat>
            </div>
          </Container>
        </Hero>

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-B0C4DB">
          <Container className="grid grid-cols-3 gap-32">
            <div className="col-span-2">
              {/* Description */}
              <SeeMoreParagraph text={coverInfo.about}></SeeMoreParagraph>

              <div className="mt-12">
                <ProvideLiquidityForm coverKey={coverKey} info={info} />
              </div>
            </div>

            <LiquidityResolutionSources
              info={info}
              refetchInfo={refetchInfo}
              isWithdrawalWindowOpen={isWithdrawalWindowOpen}
              accrueInterest={accrueInterest}
            />
          </Container>
        </div>
      </main>
    </div>
  );
};
