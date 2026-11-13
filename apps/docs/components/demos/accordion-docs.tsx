"use client";

import { RiCoupon3Line, RiSecurePaymentLine, RiSettings3Line } from "@remixicon/react";
import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";
import { cx } from "@/utils/cx";

const FAQ_ITEMS = [
  {
    id: "billing",
    title: "如何计费？",
    body: "按月为每个活跃席位计费，未使用的席位可随时停用。",
  },
  {
    id: "plans",
    title: "之后可以更换方案吗？",
    body: "随时升级，立即生效；降级在下个计费周期生效。",
  },
  {
    id: "data",
    title: "数据会保留多久？",
    body: "取消订阅后，数据仍可只读访问 30 天。",
  },
] as const;

export function AccordionDividedPreview({ className }: { className?: string }) {
  return (
    <Accordion
      variant="divided"
      defaultExpandedKeys={["billing"]}
      className={cx("w-full max-w-xl", className)}
    >
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id} title={item.title}>
          <p>{item.body}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function AccordionContainedPreview({ className }: { className?: string }) {
  return (
    <Accordion
      variant="contained"
      indicator="plus"
      defaultExpandedKeys={["billing"]}
      className={cx("w-full max-w-xl", className)}
    >
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id} title={item.title}>
          <p>{item.body}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function AccordionSeparatedPreview({ className }: { className?: string }) {
  return (
    <Accordion
      variant="separated"
      defaultExpandedKeys={["security"]}
      className={cx("w-full max-w-xl", className)}
    >
      <AccordionItem
        id="security"
        title="登录与安全"
        description="密码、二次验证与设备"
        icon={RiSecurePaymentLine}
      >
        <p>开启二次验证后，敏感操作需要额外确认。</p>
      </AccordionItem>
      <AccordionItem
        id="billing-settings"
        title="账单偏好"
        description="发票、币种与付款方式"
        icon={RiCoupon3Line}
      >
        <p>可随时更换付款方式，下一笔账单起生效。</p>
      </AccordionItem>
      <AccordionItem
        id="workspace"
        title="工作区"
        description="成员、角色与权限"
        icon={RiSettings3Line}
      >
        <p>管理员可为成员分配只读或编辑权限。</p>
      </AccordionItem>
    </Accordion>
  );
}
