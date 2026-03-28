import { CaseForm } from "@/components/case-form";

export const metadata = {
  title: "新增案件",
};

export default function NewCasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">新增案件</h1>
        <p className="text-sm text-muted-foreground">
          填寫欄位後儲存，將帶您進入詳情與試算。
        </p>
      </div>
      <CaseForm mode="create" />
    </div>
  );
}
