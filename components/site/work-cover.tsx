import type { Project } from "@/content/projects";

export function WorkCover({ id }: { id: Project["cover"] }) {
  if (id === "ledger") {
    return (
      <div className="flex h-full bg-[#101417] p-5 text-white sm:p-8">
        <div className="flex w-full flex-col justify-between rounded-[1rem] border border-white/10 p-5">
          <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.16em] text-white/50 uppercase">
            <span>Review queue</span>
            <span>04 open</span>
          </div>
          <div className="mt-6 grid flex-1 content-end gap-3">
            {[82, 64, 46, 30].map((width) => (
              <div key={width} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="h-2 rounded-full bg-white/80" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "fieldnote") {
    return (
      <div className="grid h-full grid-cols-5 bg-[#f4f1eb] text-ink">
        <div className="col-span-2 flex flex-col justify-between p-5 sm:p-7">
          <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-gray-600">Study 04</p>
          <p className="max-w-[8ch] text-3xl leading-none tracking-[-0.05em] sm:text-5xl">Courtyard house</p>
        </div>
        <div className="col-span-3 grid grid-rows-3 gap-2 p-2">
          <div className="row-span-2 bg-[#d7d1c6]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#121517]" />
            <div className="bg-accent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[1.1fr_0.9fr] bg-[#161b22] text-white">
      <div className="flex flex-col gap-3 p-5 sm:p-7">
        <p className="font-mono text-[0.65rem] tracking-[0.16em] text-white/45 uppercase">Inbox</p>
        {["Needs a person", "Draft ready", "Waiting"].map((label, index) => (
          <div key={label} className="rounded-xl border border-white/10 px-3 py-3">
            <p className="text-sm">{label}</p>
            <p className="mt-2 h-1.5 rounded-full bg-white/15" style={{ width: `${70 - index * 18}%` }} />
          </div>
        ))}
      </div>
      <div className="m-3 flex flex-col justify-between rounded-2xl bg-white p-4 text-ink">
        <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-gray-600">Reply</p>
        <p className="text-xl leading-tight tracking-[-0.04em]">From the approved answers, then a person checks it.</p>
        <span className="h-2 w-10 rounded-full bg-accent" />
      </div>
    </div>
  );
}
