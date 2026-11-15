/** Short usage snippets for MCP get_usage_examples. */
export const EXAMPLES: Record<string, string> = {
  utils: `import { cn, cx } from "@joyui/react"

cn("px-2", condition && "bg-background-secondary-default")`,

  format: `import { formatDate, formatCurrency, fromNow } from "@joyui/react"

formatDate(new Date(), "YYYY-MM-DD")
formatCurrency(1999, "CNY")
fromNow("2026-01-01")`,

  button: `import { Button } from "@joyui/react"
import { RiAddLine } from "@remixicon/react"

<Button variant="primary" leadingIcon={RiAddLine}>保存</Button>
<Button variant="secondary" size="small">取消</Button>
<Button variant="danger" isDisabled>删除</Button>`,

  input: `import { Input } from "@joyui/react"

<Input label="邮箱" placeholder="you@company.com" hint="工作邮箱" />
{/* TextField 是组合容器，不要直接传 label/placeholder */}` ,

  select: `import { Select, SelectItem } from "@joyui/react"

<Select label="角色" placeholder="选择…">
  <SelectItem id="admin">Admin</SelectItem>
  <SelectItem id="member">Member</SelectItem>
</Select>`,

  modal: `import { ModalTrigger, Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter, Button } from "@joyui/react"

<ModalTrigger>
  <Button>打开</Button>
  <Modal>
    <ModalDialog>
      <ModalHeader title="确认" />
      <ModalBody>内容</ModalBody>
      <ModalFooter>
        <Button variant="primary">确定</Button>
      </ModalFooter>
    </ModalDialog>
  </Modal>
</ModalTrigger>`,

  "data-table": `import { DataTable } from "@joyui/react"

<DataTable data={rows} columns={columns} />
{/* DataTableExample 仅文档演示，业务请用 DataTable */}`,

  "revenue-chart-card": `import { RevenueChartCard } from "@joyui/react"

<RevenueChartCard />`,

  card: `import { Card } from "@joyui/react"

<Card className="p-6">内容</Card>`,

  composer: `import { Composer, ComposerPanel } from "@joyui/react/composer"

<ComposerPanel />`,

  "admin-dashboard": `import { AdminDashboard } from "@joyui/react"

<AdminDashboard />`,
};
