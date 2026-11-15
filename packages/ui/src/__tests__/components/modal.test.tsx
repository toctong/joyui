import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JoyUIProvider } from "../../components/foundations/i18n/joy-ui-provider";
import {
  AlertDialog,
  Modal,
  ModalHeader,
  ModalTrigger,
} from "../../components/base/modal/modal";
import { Button } from "../../components/base/buttons/button";

describe("ModalHeader", () => {
  it("places the icon beside the title, not stacked above", async () => {
    const user = userEvent.setup();
    render(
      <ModalTrigger>
        <Button>打开</Button>
        <Modal>
          <ModalHeader title="确认删除？" description="不可撤销" icon={() => <svg data-testid="icon" />} />
        </Modal>
      </ModalTrigger>,
    );
    await user.click(screen.getByRole("button", { name: "打开" }));
    const title = screen.getByRole("heading", { name: "确认删除？" });
    const icon = screen.getByTestId("icon").parentElement;
    expect(icon).toBeTruthy();
    // Same flex row: icon is a previous sibling of the title column, not an ancestor.
    expect(title.parentElement?.previousElementSibling).toBe(icon);
  });
});

describe("AlertDialog i18n", () => {
  it("translates default Cancel / Confirm under zh-CN", async () => {
    const user = userEvent.setup();
    render(
      <JoyUIProvider locale="zh-CN">
        <ModalTrigger>
          <Button>删除</Button>
          <AlertDialog title="确认删除？" description="此操作不可撤销。" />
        </ModalTrigger>
      </JoyUIProvider>,
    );
    await user.click(screen.getByRole("button", { name: "删除" }));
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "确认" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });
});
