"use client";

import * as React from "react";
import { parseColor } from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  RiArchiveLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileAddLine,
  RiFileCopyLine,
  RiFilePdf2Line,
  RiFolderTransferLine,
  RiHome5Line,
  RiInboxLine,
  RiSearchLine,
  RiSettings3Line,
  RiShareLine,
  RiUserAddLine,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import {
  ColorPicker,
} from "@/components/base/color-picker/color-picker";
import { ComboBox, ComboBoxItem } from "@/components/base/combobox/combobox";
import {
  CommandPalette,
  CommandPaletteItem,
  CommandPaletteSection,
} from "@/components/base/command-palette/command-palette";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  ContextMenuTrigger,
} from "@/components/base/context-menu/context-menu";
import {
  DateCalendar,
  DateRangeCalendar,
} from "@/components/base/date-picker/date-calendar";
import { DatePicker } from "@/components/base/date-picker/date-picker";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/base/drawer/drawer";
import {
  AlertDialog,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
} from "@/components/base/modal/modal";
import { NumberField } from "@/components/base/number-field/number-field";
import { Popover, PopoverHeader, PopoverTrigger } from "@/components/base/popover/popover";
import { SearchField } from "@/components/base/search-field/search-field";
import { Tag, TagGroup } from "@/components/base/tag-group/tag-group";
import { TimeField } from "@/components/base/time-field/time-field";
import { toast, Toaster } from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";

/** Docs demos: real interactive components (not gallery static tiles). */
export const INTERACTIVE_DOC_DEMOS: Record<string, () => React.ReactElement> = {
  "context-menu": function ContextMenuDemo() {
    return (
      <div className="flex w-full flex-col items-center gap-3 py-4">
        <p className="text-body-2-regular text-text-secondary">
          右键点击 / 长按下方卡片打开菜单
        </p>
        <ContextMenuTrigger>
          {({ isOpen }) => (
            <>
              <div
                className={cx(
                  "flex w-40 cursor-default flex-col gap-3 rounded-2xl border bg-background-full p-3 shadow-xs outline-none",
                  isOpen
                    ? "border-accent-500 ring-2 ring-accent-500/20"
                    : "border-separator-border",
                )}
                tabIndex={0}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-background-secondary-default">
                  <RiFilePdf2Line
                    aria-hidden
                    className="size-5 text-foreground-icon-secondary"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="truncate text-body-medium text-text-primary">
                    Q3 report.pdf
                  </span>
                  <span className="text-body-regular text-text-tertiary">
                    2.4 MB
                  </span>
                </span>
              </div>
              <ContextMenu aria-label="文件操作">
                <ContextMenuItem id="rename" icon={RiEditLine}>
                  重命名
                </ContextMenuItem>
                <ContextMenuItem id="duplicate" icon={RiFileCopyLine} shortcut="⌘D">
                  复制
                </ContextMenuItem>
                <ContextMenuSubmenu label="移动到" icon={RiFolderTransferLine}>
                  <ContextMenuItem id="inbox" icon={RiInboxLine}>
                    收件箱
                  </ContextMenuItem>
                  <ContextMenuItem id="archive" icon={RiArchiveLine}>
                    归档
                  </ContextMenuItem>
                </ContextMenuSubmenu>
                <ContextMenuSeparator />
                <ContextMenuItem
                  id="delete"
                  icon={RiDeleteBinLine}
                  variant="danger"
                >
                  删除
                </ContextMenuItem>
              </ContextMenu>
            </>
          )}
        </ContextMenuTrigger>
      </div>
    );
  },

  "date-picker": function DatePickerDemo() {
    return (
      <div className="flex w-full flex-col items-center gap-3 py-6">
        <p className="text-body-2-regular text-text-secondary">
          点击触发器打开日历，选择日期后应用
        </p>
        <DatePicker aria-label="会议日期" />
      </div>
    );
  },

  "date-calendar": function DateCalendarDemo() {
    const now = today(getLocalTimeZone());
    const [mode, setMode] = React.useState<"single" | "range">("range");
    const [date, setDate] = React.useState(now.add({ days: 2 }));
    const [range, setRange] = React.useState({
      start: now.add({ days: 3 }),
      end: now.add({ days: 7 }),
    });

    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <div className="flex gap-2">
          <Button
            size="small"
            variant={mode === "single" ? "primary" : "secondary"}
            onClick={() => setMode("single")}
          >
            单日
          </Button>
          <Button
            size="small"
            variant={mode === "range" ? "primary" : "secondary"}
            onClick={() => setMode("range")}
          >
            区间
          </Button>
        </div>
        {mode === "single" ? (
          <DateCalendar
            aria-label="送达日期"
            value={date}
            onChange={setDate}
            minValue={now}
          />
        ) : (
          <DateRangeCalendar
            aria-label="住宿区间"
            value={range}
            onChange={setRange}
            minValue={now}
            visibleMonths={1}
          />
        )}
      </div>
    );
  },

  "color-picker": function ColorPickerDemo() {
    const [color, setColor] = React.useState(parseColor("#6366f1"));
    return (
      <div className="flex w-full justify-center py-4">
        <ColorPicker
          value={color}
          onChange={setColor}
          swatches={[
            "#ef4444",
            "#f97316",
            "#eab308",
            "#22c55e",
            "#06b6d4",
            "#6366f1",
            "#d946ef",
          ]}
        />
      </div>
    );
  },

  combobox: function ComboboxDemo() {
    const people = [
      { id: "maya", name: "Maya Chen", email: "maya@acme.com" },
      { id: "leo", name: "Leo Park", email: "leo@acme.com" },
      { id: "sofia", name: "Sofia Rossi", email: "sofia@acme.com" },
      { id: "owen", name: "Owen Park", email: "owen@acme.com" },
    ];
    return (
      <div className="flex w-full justify-center py-6">
        <ComboBox
          label="负责人"
          placeholder="搜索成员"
          leadingIcon={RiSearchLine}
          defaultItems={people}
          defaultSelectedKey="maya"
          className="w-full max-w-[320px]"
        >
          {(person) => (
            <ComboBoxItem id={person.id} textValue={person.name}>
              <span className="truncate">{person.name}</span>
              <span className="truncate text-body-2-regular text-text-tertiary">
                {person.email}
              </span>
            </ComboBoxItem>
          )}
        </ComboBox>
      </div>
    );
  },

  "command-palette": function CommandPaletteDemo() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex w-full flex-col items-center gap-3 py-6">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          打开命令面板（或按 ⌘K）
        </Button>
        <CommandPalette
          isOpen={open}
          onOpenChange={setOpen}
          onAction={() => setOpen(false)}
        >
          <CommandPaletteSection title="建议">
            <CommandPaletteItem id="create" icon={RiFileAddLine} shortcut="⌘N">
              新建项目
            </CommandPaletteItem>
            <CommandPaletteItem id="invite" icon={RiUserAddLine}>
              邀请成员
            </CommandPaletteItem>
          </CommandPaletteSection>
          <CommandPaletteSection title="导航">
            <CommandPaletteItem
              id="dashboard"
              icon={RiHome5Line}
              description="前往"
            >
              仪表盘
            </CommandPaletteItem>
            <CommandPaletteItem
              id="settings"
              icon={RiSettings3Line}
              description="前往"
            >
              设置
            </CommandPaletteItem>
          </CommandPaletteSection>
        </CommandPalette>
      </div>
    );
  },

  popover: function PopoverDemo() {
    return (
      <div className="flex w-full justify-center py-8">
        <PopoverTrigger>
          <Button variant="secondary" leadingIcon={RiShareLine}>
            分享
          </Button>
          <Popover className="w-[320px]">
            <PopoverHeader
              title="分享面板"
              description="工作区内拥有链接的人都可以查看。"
            />
            <p className="text-body-2-regular text-text-secondary break-all">
              https://joyui.dev/d/q3-revenue
            </p>
          </Popover>
        </PopoverTrigger>
      </div>
    );
  },

  modal: function ModalDemo() {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-3 py-8">
        <ModalTrigger>
          <Button leadingIcon={RiUserAddLine}>邀请成员</Button>
          <Modal>
            {({ close }) => (
              <>
                <ModalHeader
                  title="邀请成员"
                  description="他们会收到加入工作区的邮件链接。"
                />
                <ModalBody>
                  <p className="text-body-regular text-text-secondary">
                    在真实项目中这里放表单字段。
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="secondary" onClick={close}>
                    取消
                  </Button>
                  <Button onClick={close}>发送邀请</Button>
                </ModalFooter>
              </>
            )}
          </Modal>
        </ModalTrigger>
        <ModalTrigger>
          <Button variant="danger" leadingIcon={RiDeleteBinLine}>
            删除项目
          </Button>
          <AlertDialog
            title="删除项目？"
            description="项目及其文件将对所有人删除，且无法撤销。"
            confirmLabel="删除项目"
            onConfirm={async () => undefined}
          />
        </ModalTrigger>
      </div>
    );
  },

  drawer: function DrawerDemo() {
    return (
      <div className="flex w-full justify-center py-8">
        <DrawerTrigger>
          <Button variant="secondary">打开筛选抽屉</Button>
          <Drawer>
            {({ close }) => (
              <>
                <DrawerHeader
                  title="筛选"
                  description="缩小客户列表范围。"
                />
                <DrawerBody>
                  <div className="space-y-3">
                    <SearchField aria-label="搜索客户" placeholder="搜索…" />
                    <NumberField label="最低金额" defaultValue={100} />
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="secondary" onClick={close}>
                    重置
                  </Button>
                  <Button onClick={close}>应用</Button>
                </DrawerFooter>
              </>
            )}
          </Drawer>
        </DrawerTrigger>
      </div>
    );
  },

  "search-field": function SearchFieldDemo() {
    return (
      <div className="flex w-full max-w-sm justify-center py-8">
        <SearchField
          aria-label="搜索"
          placeholder="搜索组件…"
          className="w-full"
        />
      </div>
    );
  },

  "number-field": function NumberFieldDemo() {
    return (
      <div className="flex w-full max-w-xs justify-center py-8">
        <NumberField label="席位数" defaultValue={5} minValue={1} />
      </div>
    );
  },

  "time-field": function TimeFieldDemo() {
    return (
      <div className="flex w-full max-w-xs justify-center py-8">
        <TimeField label="开始时间" />
      </div>
    );
  },

  "tag-group": function TagGroupDemo() {
    return (
      <div className="flex w-full max-w-md justify-center py-8">
        <TagGroup
          label="主题"
          selectionMode="multiple"
          defaultSelectedKeys={["design", "react"]}
        >
          <Tag id="design">设计</Tag>
          <Tag id="react">React</Tag>
          <Tag id="a11y">无障碍</Tag>
          <Tag id="motion">动效</Tag>
        </TagGroup>
      </div>
    );
  },

  toast: function ToastDemo() {
    return (
      <div className="flex w-full flex-col items-center gap-3 py-8">
        <Toaster />
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => toast.success("已保存更改")}
          >
            成功提示
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.error("上传失败", { description: "请重试" })}
          >
            错误提示
          </Button>
        </div>
      </div>
    );
  },
};
