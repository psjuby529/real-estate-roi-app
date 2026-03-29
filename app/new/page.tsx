import { CaseForm } from "@/components/case-form";

export const metadata = {
  title: "新增案件",
};

export default function NewCasePage() {
  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">新增案件</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          填寫欄位後儲存，將帶您進入詳情與試算。
        </p>
      </div>
      <CaseForm mode="create" />
    </div>
  );
}
