"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useWindowSize } from "@uidotdev/usehooks";

function DialogOrDrawer({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Root = isMobile ? Drawer : Dialog;
  return <Root {...props}>{children}</Root>;
}

function DialogOrDrawerTitle({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  return <Title {...props}>{children}</Title>;
}

function DialogOrDrawerDescription({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  return <Description {...props}>{children}</Description>;
}
function DialogOrDrawerHeader({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  return <Header {...props}>{children}</Header>;
}
function DialogOrDrawerFooter({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Footer = isMobile ? DrawerFooter : DialogFooter;
  return <Footer {...props}>{children}</Footer>;
}

function DialogOrDrawerClose({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Close = isMobile ? DrawerClose : DialogClose;
  return <Close {...props}>{children}</Close>;
}

function DialogOrDrawerContent({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Content = isMobile ? DrawerContent : DialogContent;
  return (
    <Content {...props} onOpenAutoFocus={(e) => e.preventDefault()}>
      {children}
    </Content>
  );
}

function DialogOrDrawerTrigger({ children, ...props }: any) {
  const { width } = useWindowSize();
  if (!width) return null;
  const isMobile = width < 768;
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger;

  return <Trigger {...props}>{children}</Trigger>;
}

export {
  DialogOrDrawer,
  DialogOrDrawerTrigger,
  DialogOrDrawerContent,
  DialogOrDrawerTitle,
  DialogOrDrawerDescription,
  DialogOrDrawerHeader,
  DialogOrDrawerFooter,
  DialogOrDrawerClose,
};