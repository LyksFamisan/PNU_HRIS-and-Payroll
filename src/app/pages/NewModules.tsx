import { useState } from "react";
import {
  Briefcase, UserCheck, CheckCircle, Users, ChevronLeft, ChevronRight, Plus, Search,
  Star, Microscope, Activity, FileText, BookOpen, Trophy, Medal, Clock,
  GraduationCap, Target, ClipboardCheck, Stethoscope, Heart, BarChart2, Award, BookMarked,
  User, Calendar
} from "lucide-react";
import { Badge, Av, Modal, SectionHeader } from "../shared";
import { fd } from "../data";
import type {
  JobVacancy, Applicant, TrainingProgram, TrainingNomination,
  PerformanceRating, RewardNomination, WellnessRecord, FacultyProfile, Employee
} from "../types";

export function RecruitmentPage({ vacancies, applicants, onAddVacancy }: {
  vacancies: JobVacancy[]; applicants: Applicant[];
  onAddVacancy: (v: Omit<JobVacancy,"id">) => void;
}) {
  const [tab, setTab] = useState<"vacancies"|"applicants"|"workflow">("vacancies");
  const [selVacancy, setSelVacancy] = useState<JobVacancy|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ position:"", department:"", salaryGrade:1, employmentType:"Permanent", slots:1, deadline:"", qualifications:"" });
  const statusColor: Record<string,string> = {
    Open:"bg-green-100 text-green-700", Closed:"bg-gray-100 text-gray-500",
    "For Approval":"bg-amber-100 text-amber-700",
  };
  const appStatusColor: Record<string,string> = {
    Pending:"bg-gray-100 text-gray-500", Shortlisted:"bg-blue-100 text-blue-700",
    Examination:"bg-amber-100 text-amber-700", Interview:"bg-purple-100 text-purple-700",
    Passed:"bg-green-100 text-green-700", Failed:"bg-red-100 text-red-700", Hired:"bg-[#1B3A6B]/10 text-[#1B3A6B]",
  };
  const filteredApps = selVacancy ? applicants.filter(a=>a.vacancyId===selVacancy.id) : applicants;
  const STAGES = ["Pending","Shortlisted","Examination","Interview","Passed","Hired"];

  return (
    <div>
      <SectionHeader title="Recruitment, Selection & Placement" subtitle="Manage job vacancies, applicants, and hiring workflow"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Open Vacancies", value:vacancies.filter(v=>v.status==="Open").length, icon:Briefcase, color:"#1B3A6B" },
          { label:"Total Applicants", value:applicants.length, icon:Users, color:"#2563EB" },
          { label:"For Interview", value:applicants.filter(a=>a.status==="Interview").length, icon:UserCheck, color:"#7C3AED" },
          { label:"Hired This Quarter", value:applicants.filter(a=>a.status==="Hired").length, icon:CheckCircle, color:"#059669" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["vacancies","applicants","workflow"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab===t?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="vacancies"?"Job Vacancies":t==="applicants"?"Applicant Tracker":"Hiring Workflow"}
          </button>
        ))}
      </div>

      {tab==="vacancies"&&(
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Job Vacancies ({vacancies.length})</h3>
            <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{backgroundColor:"#1B3A6B"}}>
              <Plus className="w-3.5 h-3.5"/>Post Vacancy
            </button>
          </div>
          <div className="space-y-3">
            {vacancies.map(v=>(
              <div key={v.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-semibold">{v.position}</h4>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[v.status]}`}>{v.status}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{v.employmentType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{v.department} · SG {v.salaryGrade} · {v.slots} slot{v.slots>1?"s":""}</p>
                    <p className="text-xs text-foreground/70 line-clamp-2">{v.qualifications}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-xs font-semibold">{fd(v.deadline)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{v.applicants} applicant{v.applicants!==1?"s":""}</p>
                    <button onClick={()=>{setSelVacancy(v);setTab("applicants");}}
                      className="mt-2 text-[11px] text-[#1B3A6B] font-medium hover:underline">View Applicants →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="applicants"&&(
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold">Applicants {selVacancy?`— ${selVacancy.position}`:""}</h3>
            {selVacancy&&<button onClick={()=>setSelVacancy(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5"/>All Applicants</button>}
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Applicant","Type","Applied","Stage","Score",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
              </tr></thead>
              <tbody>{filteredApps.map(a=>(
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-semibold">{a.name}</p><p className="text-xs text-muted-foreground">{a.email}</p></td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full ${a.type==="Internal"?"bg-[#1B3A6B]/10 text-[#1B3A6B]":"bg-muted text-muted-foreground"}`}>{a.type}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fd(a.appliedDate)}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${appStatusColor[a.status]}`}>{a.status}</span></td>
                  <td className="px-4 py-3 text-xs font-mono">{a.score!=null?`${a.score}/100`:"—"}</td>
                  <td className="px-4 py-3"><button className="text-[11px] text-[#1B3A6B] hover:underline font-medium">View</button></td>
                </tr>
              ))}</tbody>
            </table>
            {filteredApps.length===0&&<div className="py-8 text-center text-sm text-muted-foreground">No applicants found</div>}
          </div>
        </div>
      )}

      {tab==="workflow"&&(
        <div>
          <h3 className="text-sm font-semibold mb-4">Recruitment Workflow Pipeline</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES.map(stage=>{
              const stageApps = applicants.filter(a=>a.status===stage);
              return (
                <div key={stage} className="rounded-xl border p-4 shadow-sm bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">{stage}</h4>
                    <span className="text-lg font-bold">{stageApps.length}</span>
                  </div>
                  {stageApps.slice(0,3).map(a=>(
                    <div key={a.id} className="text-xs py-1.5 border-b border-black/5 last:border-0">
                      <p className="font-medium truncate">{a.name.split(",")[0]}</p>
                      <p className="text-muted-foreground">{a.type}</p>
                    </div>
                  ))}
                  {stageApps.length>3&&<p className="text-xs text-muted-foreground mt-1">+{stageApps.length-3} more</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-6 bg-card rounded-xl border border-border p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4">Standard Recruitment Process</h4>
            <div className="flex flex-wrap items-center gap-2">
              {["Registration","Document Screening","Examination","Assessment","Interview","PSB Evaluation","Ranking","Recommendation","Appointment","Hiring"].map((step,i,arr)=>(
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                    <span className="text-[11px] font-bold text-muted-foreground">{i+1}</span>
                    <span className="text-xs font-medium">{step}</span>
                  </div>
                  {i<arr.length-1&&<ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0"/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Post New Job Vacancy">
        <div className="space-y-3">
          {[["Position Title","position","text"],["Department","department","text"],["Qualification Standards","qualifications","text"],["Application Deadline","deadline","date"]].map(([label,field,type])=>(
            <div key={field}><label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
            <input type={type} value={(form as any)[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30"/></div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Salary Grade</label>
            <input type="number" min={1} max={33} value={form.salaryGrade} onChange={e=>setForm(f=>({...f,salaryGrade:+e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Slots</label>
            <input type="number" min={1} value={form.slots} onChange={e=>setForm(f=>({...f,slots:+e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
            <select value={form.employmentType} onChange={e=>setForm(f=>({...f,employmentType:e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
              {["Permanent","Temporary","Casual","Contractual","Job Order","COS","Part-Time"].map(t=><option key={t}>{t}</option>)}
            </select></div>
          </div>
          <button onClick={()=>{
            if(form.position&&form.department&&form.deadline){
              onAddVacancy({...form,status:"For Approval",applicants:0});
              setShowAdd(false); setForm({position:"",department:"",salaryGrade:1,employmentType:"Permanent",slots:1,deadline:"",qualifications:""});
            }
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{backgroundColor:"#1B3A6B"}}>
            Submit for Approval
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function TrainingPage({ programs, nominations, employees, onNominate }: {
  programs: TrainingProgram[]; nominations: TrainingNomination[];
  employees: Employee[]; onNominate: (n: Omit<TrainingNomination,"id">) => void;
}) {
  const [tab, setTab] = useState<"programs"|"nominations"|"history">("programs");
  const [showNom, setShowNom] = useState<TrainingProgram|null>(null);
  const [nomForm, setNomForm] = useState({ employeeId:"", note:"" });
  const statusColor: Record<string,string> = {
    Upcoming:"bg-blue-100 text-blue-700", Ongoing:"bg-green-100 text-green-700",
    Completed:"bg-gray-100 text-gray-500", Cancelled:"bg-red-100 text-red-700",
  };
  const nomStatusColor: Record<string,string> = {
    Pending:"bg-amber-100 text-amber-700", Approved:"bg-green-100 text-green-700",
    Completed:"bg-[#1B3A6B]/10 text-[#1B3A6B]", Declined:"bg-red-100 text-red-700",
  };
  const typeColor: Record<string,string> = {
    Mandatory:"bg-red-100 text-red-700", Optional:"bg-blue-100 text-blue-700", Scholarship:"bg-amber-100 text-amber-700",
  };

  return (
    <div>
      <SectionHeader title="Learning & Development" subtitle="Training programs, nominations, and employee competency development"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Programs", value:programs.length, icon:GraduationCap, color:"#1B3A6B" },
          { label:"Upcoming", value:programs.filter(p=>p.status==="Upcoming").length, icon:Calendar, color:"#2563EB" },
          { label:"Total Nominations", value:nominations.length, icon:Users, color:"#059669" },
          { label:"Completed Trainings", value:programs.filter(p=>p.status==="Completed").length, icon:CheckCircle, color:"#7C3AED" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["programs","nominations","history"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="programs"?"Training Programs":t==="nominations"?"Nominations":"Training History"}
          </button>
        ))}
      </div>

      {tab==="programs"&&(
        <div className="space-y-3">
          {programs.map(p=>(
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold">{p.title}</h4>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[p.status]}`}>{p.status}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${typeColor[p.type]}`}>{p.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{p.organizer} · {p.venue}</p>
                  <p className="text-xs text-foreground/70">{fd(p.startDate)}{p.startDate!==p.endDate?` — ${fd(p.endDate)}`:""} · {p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{p.nominated}/{p.slots} nominated</p>
                  <div className="w-24 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{backgroundColor:"#1B3A6B",width:`${Math.min(100,(p.nominated/p.slots)*100)}%`}}/>
                  </div>
                  {p.status==="Upcoming"&&(
                    <button onClick={()=>setShowNom(p)}
                      className="mt-2 text-[11px] font-medium text-white px-3 py-1 rounded-lg" style={{backgroundColor:"#1B3A6B"}}>
                      Nominate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="nominations"&&(
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Employee","Department","Training","Nominated","Status"].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody>{nominations.map(n=>{
              const prog = programs.find(p=>p.id===n.programId);
              return (
                <tr key={n.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs font-semibold">{n.employeeName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{n.department}</td>
                  <td className="px-4 py-3 text-xs max-w-[200px] truncate">{prog?.title||"—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fd(n.nominatedDate)}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${nomStatusColor[n.status]}`}>{n.status}</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {tab==="history"&&(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#1B3A6B]"/>Training Categories</h4>
            {["Pedagogy","Mandatory","ICT","International","HR Management"].map(cat=>{
              const cnt = programs.filter(p=>p.category===cat).length;
              return (
                <div key={cat} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{backgroundColor:"#1B3A6B",width:`${(cnt/programs.length)*100}%`}}/>
                    </div>
                    <span className="text-xs text-muted-foreground w-4">{cnt}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#1B3A6B]"/>Completion Statistics</h4>
            {[
              { label:"Programs Completed", value:programs.filter(p=>p.status==="Completed").length },
              { label:"Total Employee-Trainings", value:nominations.filter(n=>n.status==="Completed").length },
              { label:"Scholarship Grants", value:programs.filter(p=>p.type==="Scholarship").length },
              { label:"Average Completion Rate", value:"96.2%" },
            ].map(s=>(
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={!!showNom} onClose={()=>setShowNom(null)} title={`Nominate for: ${showNom?.title||""}`}>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Select Employee</label>
          <select value={nomForm.employeeId} onChange={e=>setNomForm(f=>({...f,employeeId:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
            <option value="">— Choose employee —</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}
          </select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Justification / Note</label>
          <textarea value={nomForm.note} onChange={e=>setNomForm(f=>({...f,note:e.target.value}))} rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/></div>
          <button onClick={()=>{
            if(nomForm.employeeId&&showNom){
              const emp = employees.find(e=>e.id===nomForm.employeeId);
              if(emp) onNominate({programId:showNom.id,employeeId:emp.id,employeeName:emp.fullName,department:emp.department,status:"Pending",nominatedDate:new Date().toISOString().slice(0,10)});
              setShowNom(null); setNomForm({employeeId:"",note:""});
            }
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{backgroundColor:"#1B3A6B"}}>
            Submit Nomination
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function PerformancePage({ ratings }: { ratings: PerformanceRating[] }) {
  const [tab, setTab] = useState<"ipcr"|"opcr"|"summary">("ipcr");
  const [searchQ, setSearchQ] = useState("");
  const adjectivalColor: Record<string,string> = {
    Outstanding:"bg-[#1B3A6B]/10 text-[#1B3A6B]",
    "Very Satisfactory":"bg-green-100 text-green-700",
    Satisfactory:"bg-amber-100 text-amber-700",
    "Unsatisfactory":"bg-red-100 text-red-700",
  };
  const statusColor: Record<string,string> = {
    Draft:"bg-gray-100 text-gray-500", Submitted:"bg-blue-100 text-blue-700",
    Reviewed:"bg-amber-100 text-amber-700", Approved:"bg-green-100 text-green-700",
  };
  const filtered = ratings.filter(r=>r.type===(tab==="ipcr"?"IPCR":"OPCR")&&(r.employeeName.toLowerCase().includes(searchQ.toLowerCase())||r.department.toLowerCase().includes(searchQ.toLowerCase())));
  const outstanding = ratings.filter(r=>r.adjectivalRating==="Outstanding").length;
  const avg = ratings.length?+(ratings.reduce((s,r)=>s+r.finalRating,0)/ratings.length).toFixed(2):0;

  return (
    <div>
      <SectionHeader title="Performance Management" subtitle="IPCR, OPCR, and performance-based evaluation system"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Submissions", value:ratings.length, icon:ClipboardCheck, color:"#1B3A6B" },
          { label:"Outstanding", value:outstanding, icon:Star, color:"#C8A84B" },
          { label:"Average Rating", value:avg, icon:Target, color:"#059669" },
          { label:"Pending Review", value:ratings.filter(r=>r.status==="Submitted").length, icon:Clock, color:"#7C3AED" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["ipcr","opcr","summary"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="ipcr"?"IPCR Ratings":t==="opcr"?"OPCR Ratings":"Summary Report"}
          </button>
        ))}
      </div>

      {(tab==="ipcr"||tab==="opcr")&&(
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search employee or department..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/30 bg-white"/>
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} record{filtered.length!==1?"s":""}</span>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Employee","Department","Period","Output","Efficiency","Timeliness","Final Rating","Adjectival","Status"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map(r=>(
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{r.employeeName.split(". ").pop()?.split(",")[0]}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.department}</td>
                  <td className="px-4 py-3 text-xs">{r.period}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.outputScore.toFixed(1)}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.efficiencyScore.toFixed(1)}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.timelinessScore.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{color:r.finalRating>=4.5?"#C8A84B":r.finalRating>=3.5?"#059669":"#DC2626"}}>{r.finalRating.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${adjectivalColor[r.adjectivalRating]||"bg-muted"}`}>{r.adjectivalRating}</span></td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="summary"&&(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-[#1B3A6B]"/>Rating Distribution</h4>
            {["Outstanding","Very Satisfactory","Satisfactory","Unsatisfactory"].map(adj=>{
              const cnt = ratings.filter(r=>r.adjectivalRating===adj).length;
              const pct = ratings.length?(cnt/ratings.length)*100:0;
              return (
                <div key={adj} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{adj}</span>
                    <span className="text-xs font-bold">{cnt} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width:`${pct}%`,
                      backgroundColor:adj==="Outstanding"?"#C8A84B":adj==="Very Satisfactory"?"#059669":adj==="Satisfactory"?"#D97706":"#DC2626"
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-[#1B3A6B]"/>Performance Summary</h4>
            {[
              { label:"Overall Average Rating", value:avg.toString() },
              { label:"Highest Rating", value:Math.max(...ratings.map(r=>r.finalRating)).toFixed(2) },
              { label:"Lowest Rating", value:Math.min(...ratings.map(r=>r.finalRating)).toFixed(2) },
              { label:"IPCR Submissions", value:ratings.filter(r=>r.type==="IPCR").length },
              { label:"OPCR Submissions", value:ratings.filter(r=>r.type==="OPCR").length },
              { label:"Approval Rate", value:`${ratings.length?((ratings.filter(r=>r.status==="Approved").length/ratings.length)*100).toFixed(0):0}%` },
            ].map(s=>(
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RewardsPage({ nominations, employees, onNominate }: {
  nominations: RewardNomination[]; employees: Employee[];
  onNominate: (n: Omit<RewardNomination,"id">) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ awardType:"Outstanding Employee Award", nomineeId:"", reason:"", period:"AY 2023-2024" });
  const AWARD_TYPES = ["Outstanding Employee Award","Outstanding Teacher Award","Research Award","Extension Award","Perfect Attendance Incentive","PRAISE Nomination","Loyalty Incentive","Gawad Agad Award","Performance Based Bonus","Productivity Enhancement Incentive"];
  const statusColor: Record<string,string> = {
    Pending:"bg-amber-100 text-amber-700", Endorsed:"bg-blue-100 text-blue-700",
    Approved:"bg-green-100 text-green-700", Rejected:"bg-red-100 text-red-700",
  };
  const awardIcon: Record<string,React.ElementType> = {
    "Outstanding Employee Award":Trophy,"Outstanding Teacher Award":Star,"Research Award":Microscope,
    "Perfect Attendance Incentive":CheckCircle,"PRAISE Nomination":Award,"Loyalty Incentive":Medal,
    "Extension Award":Heart,
  };
  const filtered = filter==="All" ? nominations : nominations.filter(n=>n.status===filter);

  return (
    <div>
      <SectionHeader title="Rewards & Recognition" subtitle="PRAISE nominations, institutional awards, and employee recognition programs"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Nominations", value:nominations.length, icon:Award, color:"#C8A84B" },
          { label:"Approved", value:nominations.filter(n=>n.status==="Approved").length, icon:Trophy, color:"#059669" },
          { label:"Pending Review", value:nominations.filter(n=>n.status==="Pending").length, icon:Clock, color:"#D97706" },
          { label:"Award Types", value:AWARD_TYPES.length, icon:Star, color:"#1B3A6B" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1 bg-muted/40 p-1 rounded-xl">
          {["All","Pending","Endorsed","Approved","Rejected"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===f?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{f}</button>
          ))}
        </div>
        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{backgroundColor:"#1B3A6B"}}>
          <Plus className="w-3.5 h-3.5"/>Nominate
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(n=>{
          const IconComp = awardIcon[n.awardType]||Award;
          return (
            <div key={n.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(200,168,75,0.12)"}}>
                  <IconComp className="w-5 h-5" style={{color:"#C8A84B"}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold">{n.awardType}</h4>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[n.status]}`}>{n.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1"><strong>{n.nomineeName}</strong> · {n.department} · {n.period}</p>
                  <p className="text-xs text-foreground/70 line-clamp-2">{n.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">Nominated by {n.nominatedBy} · {fd(n.dateNominated)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Submit Award Nomination">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Award Type</label>
          <select value={form.awardType} onChange={e=>setForm(f=>({...f,awardType:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
            {AWARD_TYPES.map(t=><option key={t}>{t}</option>)}
          </select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Nominee</label>
          <select value={form.nomineeId} onChange={e=>setForm(f=>({...f,nomineeId:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
            <option value="">— Select employee —</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}
          </select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Period</label>
          <input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Justification / Reason</label>
          <textarea value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/></div>
          <button onClick={()=>{
            const emp = employees.find(e=>e.id===form.nomineeId);
            if(emp&&form.reason){
              onNominate({...form,nomineeId:emp.id,nomineeName:emp.fullName,department:emp.department,nominatedBy:"HR Administrator",status:"Pending",dateNominated:new Date().toISOString().slice(0,10)});
              setShowAdd(false); setForm({awardType:"Outstanding Employee Award",nomineeId:"",reason:"",period:"AY 2023-2024"});
            }
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{backgroundColor:"#C8A84B", color:"#1A2744"}}>
            Submit Nomination
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function WellnessPage({ records, employees, onAdd }: {
  records: WellnessRecord[]; employees: Employee[];
  onAdd: (r: Omit<WellnessRecord,"id">) => void;
}) {
  const [tab, setTab] = useState<"records"|"programs"|"stats">("records");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId:"", type:"Medical" as WellnessRecord["type"], description:"", date:"", provider:"PNU Medical Clinic" });
  const typeColor: Record<string,string> = {
    Medical:"bg-blue-100 text-blue-700", Dental:"bg-teal-100 text-teal-700",
    "Mental Health":"bg-purple-100 text-purple-700", "Wellness Program":"bg-green-100 text-green-700",
  };
  const typeIcon: Record<string,React.ElementType> = {
    Medical:Stethoscope, Dental:User, "Mental Health":Heart, "Wellness Program":Activity,
  };
  const statusColor: Record<string,string> = {
    Scheduled:"bg-amber-100 text-amber-700", Completed:"bg-green-100 text-green-700", Cancelled:"bg-red-100 text-red-700",
  };
  const WELLNESS_PROGRAMS = [
    { name:"Annual Executive Medical Check-up", description:"Complete physical examination for officials and key staff", target:"SG 20 and above", schedule:"July–August annually", status:"Ongoing" },
    { name:"Annual Medical Check-up (General)", description:"Basic check-up for all permanent employees", target:"All permanent employees", schedule:"July–September annually", status:"Ongoing" },
    { name:"Dental Care Program", description:"Free prophylaxis, tooth extraction, and basic dental services", target:"All employees", schedule:"Year-round (by appointment)", status:"Active" },
    { name:"Mental Health Awareness & Counseling", description:"Group counseling, stress management, and psychological wellness sessions", target:"All employees", schedule:"Monthly/Quarterly", status:"Active" },
    { name:"Physical Fitness & Sports Program", description:"Zumba, aerobics, badminton, basketball tournaments", target:"All employees", schedule:"Every Friday / semester-based", status:"Active" },
    { name:"PhilHealth Availment Facilitation", description:"Assistance for PhilHealth hospitalization and outpatient claims", target:"All employees", schedule:"Year-round", status:"Active" },
  ];

  return (
    <div>
      <SectionHeader title="Health & Wellness" subtitle="Employee health records, wellness programs, and medical monitoring"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Health Records", value:records.length, icon:Stethoscope, color:"#1B3A6B" },
          { label:"Scheduled", value:records.filter(r=>r.status==="Scheduled").length, icon:Calendar, color:"#D97706" },
          { label:"Completed This Month", value:records.filter(r=>r.status==="Completed").length, icon:CheckCircle, color:"#059669" },
          { label:"Wellness Programs", value:WELLNESS_PROGRAMS.length, icon:Heart, color:"#DC2626" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["records","programs","stats"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="records"?"Health Records":t==="programs"?"Wellness Programs":"Health Statistics"}
          </button>
        ))}
      </div>

      {tab==="records"&&(
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Health & Wellness Records ({records.length})</h3>
            <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{backgroundColor:"#1B3A6B"}}>
              <Plus className="w-3.5 h-3.5"/>Add Record
            </button>
          </div>
          <div className="space-y-3">
            {records.map(r=>{
              const IconComp = typeIcon[r.type]||Heart;
              return (
                <div key={r.id} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(27,58,107,0.08)"}}>
                    <IconComp className="w-4 h-4 text-[#1B3A6B]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-xs font-semibold">{r.employeeName}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${typeColor[r.type]}`}>{r.type}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-foreground/80">{r.description}</p>
                    <p className="text-xs text-muted-foreground">{r.provider} · {fd(r.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==="programs"&&(
        <div className="space-y-3">
          {WELLNESS_PROGRAMS.map(p=>(
            <div key={p.name} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 shrink-0" style={{color:"#DC2626"}}/>
                    <h4 className="text-sm font-semibold">{p.name}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{p.status}</span>
                  </div>
                  <p className="text-xs text-foreground/70 mb-1">{p.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span><strong>Target:</strong> {p.target}</span>
                    <span><strong>Schedule:</strong> {p.schedule}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="stats"&&(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-[#1B3A6B]"/>Records by Type</h4>
            {["Medical","Dental","Mental Health","Wellness Program"].map(type=>{
              const cnt = records.filter(r=>r.type===type).length;
              return (
                <div key={type} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{type}</span>
                    <span className="text-xs font-bold">{cnt}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${records.length?(cnt/records.length)*100:0}%`,backgroundColor:"#1B3A6B"}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-[#1B3A6B]"/>Wellness Metrics</h4>
            {[
              { label:"Total Beneficiaries", value:"847 employees" },
              { label:"Medical Check-up Coverage", value:"92.4%" },
              { label:"Mental Health Sessions (YTD)", value:"24 sessions" },
              { label:"Dental Consultations (YTD)", value:"218 employees" },
              { label:"Fitness Program Participants", value:"156 active" },
              { label:"PhilHealth Availment Assisted", value:"34 cases" },
            ].map(s=>(
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Health / Wellness Record">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Employee</label>
          <select value={form.employeeId} onChange={e=>setForm(f=>({...f,employeeId:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
            <option value="">— Select employee —</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}
          </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as WellnessRecord["type"]}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
              {["Medical","Dental","Mental Health","Wellness Program"].map(t=><option key={t}>{t}</option>)}
            </select></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
          </div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
          <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Provider / Clinic</label>
          <input value={form.provider} onChange={e=>setForm(f=>({...f,provider:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
          <button onClick={()=>{
            const emp = employees.find(e=>e.id===form.employeeId);
            if(emp&&form.date&&form.description){
              onAdd({...form,employeeName:emp.fullName,status:"Scheduled"});
              setShowAdd(false); setForm({employeeId:"",type:"Medical",description:"",date:"",provider:"PNU Medical Clinic"});
            }
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{backgroundColor:"#1B3A6B"}}>
            Save Record
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function FacultyPage({ profiles, employees }: { profiles: FacultyProfile[]; employees: Employee[] }) {
  const [tab, setTab] = useState<"directory"|"evaluation"|"workload">("directory");
  const [search, setSearch] = useState("");
  const rankColor: Record<string,string> = {
    "Instructor":"bg-gray-100 text-gray-600",
    "Assistant Professor":"bg-blue-100 text-blue-700",
    "Associate Professor":"bg-purple-100 text-purple-700",
    "Professor":"bg-[#1B3A6B]/10 text-[#1B3A6B]",
    "University Professor":"bg-amber-100 text-amber-700",
  };
  const facultyEmployees = employees.filter(e=>profiles.some(p=>p.employeeId===e.id));
  const filtered = facultyEmployees.filter(e=>{
    const q = search.toLowerCase();
    return e.fullName.toLowerCase().includes(q)||e.department.toLowerCase().includes(q)||
      (profiles.find(p=>p.employeeId===e.id)?.specialization||"").toLowerCase().includes(q);
  });
  const totalPublications = profiles.reduce((s,p)=>s+p.publications,0);
  const totalResearch = profiles.reduce((s,p)=>s+p.researchCount,0);
  const avgEval = profiles.length?(profiles.reduce((s,p)=>s+p.evaluation,0)/profiles.length).toFixed(2):0;

  return (
    <div>
      <SectionHeader title="Faculty Management" subtitle="Faculty profiles, academic evaluation, teaching load, and research tracking"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Faculty", value:profiles.length, icon:GraduationCap, color:"#1B3A6B" },
          { label:"Total Publications", value:totalPublications, icon:BookMarked, color:"#2563EB" },
          { label:"Research Projects", value:totalResearch, icon:Microscope, color:"#7C3AED" },
          { label:"Avg. Evaluation", value:avgEval, icon:Star, color:"#C8A84B" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["directory","evaluation","workload"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?"bg-white text-[#1B3A6B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="directory"?"Faculty Directory":t==="evaluation"?"Evaluation":"Teaching Load"}
          </button>
        ))}
      </div>

      {tab==="directory"&&(
        <div>
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search faculty..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"/>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(emp=>{
              const prof = profiles.find(p=>p.employeeId===emp.id)!;
              if(!prof) return null;
              return (
                <div key={emp.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Av name={emp.fullName} color={emp.color} size="lg"/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-xs font-bold">{emp.fullName}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{prof.specialization}</p>
                      <p className="text-[11px] text-muted-foreground">{prof.highestDegree} · {prof.university}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {[
                          { label:"Load", value:`${prof.teachingLoad} units`, icon:BookOpen },
                          { label:"Research", value:prof.researchCount, icon:Microscope },
                          { label:"Publications", value:prof.publications, icon:FileText },
                          { label:"Awards", value:prof.awards, icon:Trophy },
                        ].map(s=>(
                          <div key={s.label} className="flex items-center gap-1 text-[11px]">
                            <s.icon className="w-3 h-3 text-muted-foreground"/><strong>{s.value}</strong><span className="text-muted-foreground ml-0.5">{s.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">{[1,2,3,4,5].map(i=><Star key={i} className={`w-3 h-3 ${i<=Math.round(prof.evaluation)?"text-amber-400":"text-muted"}`} fill={i<=Math.round(prof.evaluation)?"currentColor":"none"}/>)}</div>
                        <span className="text-[11px] font-mono">{prof.evaluation.toFixed(1)} evaluation</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==="evaluation"&&(
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Faculty","Rank","Specialization","Research","Publications","Extension","Awards","Eval Score"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>{profiles.map(prof=>{
              const emp = employees.find(e=>e.id===prof.employeeId);
              if(!emp) return null;
              return (
                <tr key={prof.employeeId} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{emp.fullName.split(". ").pop()?.split(",")[0]}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank}</span></td>
                  <td className="px-4 py-3 text-xs max-w-[150px] truncate">{prof.specialization}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.researchCount}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.publications}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.extensionCount}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.awards}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{color:prof.evaluation>=4.5?"#C8A84B":prof.evaluation>=4?"#059669":"#DC2626"}}>{prof.evaluation.toFixed(1)}</span>
                      <div className="flex">{[1,2,3,4,5].map(i=><Star key={i} className={`w-2.5 h-2.5 ${i<=Math.round(prof.evaluation)?"text-amber-400":"text-muted"}`} fill={i<=Math.round(prof.evaluation)?"currentColor":"none"}/>)}</div>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {tab==="workload"&&(
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {[
              { label:"Avg Teaching Load", value:`${(profiles.reduce((s,p)=>s+p.teachingLoad,0)/profiles.length).toFixed(1)} units` },
              { label:"Overloaded Faculty", value:profiles.filter(p=>p.teachingLoad>18).length },
              { label:"Research Active", value:profiles.filter(p=>p.researchCount>0).length },
            ].map(s=>(
              <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm text-center">
                <p className="text-2xl font-bold" style={{color:"#1B3A6B"}}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Faculty","Rank","Teaching Load","Research","Extension","Admin Work","Total Load"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>{profiles.map(prof=>{
                const emp = employees.find(e=>e.id===prof.employeeId);
                if(!emp) return null;
                const admin = prof.rank==="University Professor"||prof.rank==="Professor"?3:0;
                const total = prof.teachingLoad + (prof.researchCount*3) + prof.extensionCount + admin;
                return (
                  <tr key={prof.employeeId} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{emp.fullName.split(". ").pop()?.split(",")[0]}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank.replace("University ","U.")}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-mono font-bold ${prof.teachingLoad>18?"text-red-600":"text-foreground"}`}>{prof.teachingLoad} units</span></td>
                    <td className="px-4 py-3 text-xs font-mono">{prof.researchCount} proj.</td>
                    <td className="px-4 py-3 text-xs font-mono">{prof.extensionCount} prog.</td>
                    <td className="px-4 py-3 text-xs font-mono">{admin} units</td>
                    <td className="px-4 py-3 text-xs font-bold font-mono">{total}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
