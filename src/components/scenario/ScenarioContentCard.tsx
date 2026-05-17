import { HelpCircle } from "lucide-react";
import type { Scenario, Theme } from "../../types";

interface ScenarioContentCardProps {
  theme: Theme;
  scenario: Scenario;
}

const ScenarioMessage = ({ scenario, theme }: ScenarioContentCardProps) => (
  <div className={`space-y-3 rounded-2xl border p-5 text-base leading-relaxed ${theme === "dark" ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
    {scenario.content.data.from && <p className="text-sm font-bold text-slate-500">От: {scenario.content.data.from}</p>}
    {scenario.content.data.sender && <p className="text-sm font-bold text-slate-500">Отправитель: {scenario.content.data.sender}</p>}
    {scenario.content.data.caller && <p className="text-sm font-bold text-slate-500">Звонок: {scenario.content.data.caller}</p>}
    {scenario.content.data.url && <p className="break-all text-sm font-bold text-slate-500">URL: {scenario.content.data.url}</p>}
    {scenario.content.data.subject && <p className="text-lg font-black">{scenario.content.data.subject}</p>}
    {scenario.content.data.headline && <p className="text-lg font-black">{scenario.content.data.headline}</p>}
    <p className="font-medium">{scenario.content.data.text ?? scenario.content.data.body}</p>
    {scenario.content.data.buttonLabel && (
      <span className="inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white">
        {scenario.content.data.buttonLabel}
      </span>
    )}
  </div>
);

export const ScenarioContentCard = ({ theme, scenario }: ScenarioContentCardProps) => (
  <section className={`overflow-hidden rounded-[30px] border shadow-sm ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
    <div className="h-56 overflow-hidden md:h-72">
      <img src={scenario.image} className="h-full w-full object-cover" alt="" />
    </div>
    <div className="space-y-5 p-5 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-2xl font-black tracking-tight">{scenario.title}</h4>
          <p className={`mt-2 text-base leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
            {scenario.description}
          </p>
        </div>
      </div>
      <ScenarioMessage theme={theme} scenario={scenario} />
    </div>
  </section>
);

