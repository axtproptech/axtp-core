import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  RiArrowLeftCircleLine,
  RiHome6Line,
  RiQuestionLine,
  RiSaveLine,
  RiSettings4Line,
  RiWallet3Line,
} from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { Layout } from "@/app/components/layout";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { FC, useEffect, useState } from "react";
import { TermsSigning } from "@/features/kyc/termsSigning";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";
import { useRouter } from "next/router";
import { useAppContext } from "@/app/hooks/useAppContext";
import NProgress from "nprogress";
import { openExternalUrl } from "@/app/openExternalUrl";
import { Container } from "@/app/components/layout/container";
import { Body } from "@/app/components/layout/body";
import {
  BottomNavigation,
  BottomNavigationProvider,
} from "@/app/components/navigation/bottomNavigation";
import { Notification } from "@/app/components/notification";
import { ChildrenProps } from "@/types/childrenProps";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export const LayoutTest = ({ children }: ChildrenProps) => {
  return (
    <Container>
      <BottomNavigationProvider navItems={[]}>
        <Body>{children}</Body>
        <BottomNavigation />
      </BottomNavigationProvider>
      <Notification />
    </Container>
  );
};

export default function Signing() {
  return (
    <WithAccountOnly>
      <LayoutTest>
        <TermsSigning />
      </LayoutTest>
    </WithAccountOnly>
  );
}
