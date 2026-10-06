import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Flame,
  Activity,
  Heart,
  ShieldAlert,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Trash2,
  Filter,
  CheckCircle2,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type TrialRegistration } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/table")({
  head: () => ({
    meta: [
      { title: "Registered Users — 14-Day Yoga Program | Mivora Academy" },
      { name: "description", content: "Registrations list and export for 14-Day Free Yoga Program" },
    ],
  }),
  component: RegistrationsTablePage,
});

export function RegistrationsTablePage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [commitmentFilter, setCommitmentFilter] = useState("all");
  const [restrictionFilter, setRestrictionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<TrialRegistration | null>(null);
  const [userToDelete, setUserToDelete] = useState<TrialRegistration | null>(null);

  // Fetch registrations
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["trialRegistrations"],
    queryFn: () => api.trial.list({ all: true }),
  });

  // Fetch summary stats
  const { data: statsData } = useQuery({
    queryKey: ["trialStats"],
    queryFn: () => api.trial.stats(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.trial.delete(id),
    onSuccess: () => {
      toast.success("Registration deleted");
      queryClient.invalidateQueries({ queryKey: ["trialRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["trialStats"] });
      setUserToDelete(null);
      if (selectedUser?._id === userToDelete?._id) {
        setSelectedUser(null);
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete");
    },
  });

  const registrations = data?.registrations ?? [];

  // Filtered registrations
  const filteredList = useMemo(() => {
    return registrations.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.whatsappNumber.toLowerCase().includes(q) ||
        item.profession.toLowerCase().includes(q);

      const matchesProfession =
        professionFilter === "all" || item.profession === professionFilter;

      const matchesExperience =
        experienceFilter === "all" || item.yogaExperience.toLowerCase().includes(experienceFilter.toLowerCase());

      const matchesCommitment =
        commitmentFilter === "all" || item.morningCommitment.toLowerCase().includes(commitmentFilter.toLowerCase());

      const matchesRestriction =
        restrictionFilter === "all" || item.hasPhysicalRestrictions === restrictionFilter;

      return matchesSearch && matchesProfession && matchesExperience && matchesCommitment && matchesRestriction;
    });
  }, [registrations, searchTerm, professionFilter, experienceFilter, commitmentFilter, restrictionFilter]);

  // EXPORT AS CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Age",
      "WhatsApp Number",
      "Email Address",
      "Profession",
      "Profession (Other)",
      "Yoga Experience",
      "Goals / Interests",
      "Goals (Other)",
      "Hopes to Gain",
      "Physical Restrictions",
      "Restrictions Details",
      "Morning Commitment (5:15-6:15 AM)",
      "Comfortable with Guidance",
      "How Found Us",
      "Found Us (Other)",
      "Agreed to Terms",
      "Future Updates",
      "Registration Date",
    ];

    const rows = filteredList.map((r, index) => [
      index + 1,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.age,
      `"${r.whatsappNumber.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.profession.replace(/"/g, '""')}"`,
      `"${(r.professionOther || "").replace(/"/g, '""')}"`,
      `"${r.yogaExperience.replace(/"/g, '""')}"`,
      `"${(r.goals || []).join(", ").replace(/"/g, '""')}"`,
      `"${(r.goalsOther || "").replace(/"/g, '""')}"`,
      `"${(r.hopesToGain || "").replace(/"/g, '""')}"`,
      `"${r.hasPhysicalRestrictions}"`,
      `"${(r.physicalRestrictionsDetail || "").replace(/"/g, '""')}"`,
      `"${r.morningCommitment.replace(/"/g, '""')}"`,
      `"${r.comfortableFollowingGuidance}"`,
      `"${(r.hearAbout || "").replace(/"/g, '""')}"`,
      `"${(r.hearAboutOther || "").replace(/"/g, '""')}"`,
      r.agreeTerms ? "Yes" : "No",
      `"${r.futureUpdates || ""}"`,
      `"${new Date(r.createdAt).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Mivora_Yoga_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredList.length} registrations as CSV`);
  };

  // EXPORT AS EXCEL (.xlsx / XML Workbook)
  const handleExportExcel = () => {
    if (filteredList.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>14-Day Yoga Registrations</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; }
          th { background-color: #1b4332; color: #ffffff; font-weight: bold; border: 1px solid #cccccc; padding: 10px; text-align: left; }
          td { border: 1px solid #e0e0e0; padding: 8px; vertical-align: top; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .highlight { background-color: #d1fae5; font-weight: bold; }
          .warning { background-color: #fee2e2; }
        </style>
      </head>
      <body>
        <h2>MIVORA ACADEMY — 14-Day Free Yoga Program (04–17 October 2026)</h2>
        <p>Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredList.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>WhatsApp Number</th>
              <th>Email Address</th>
              <th>Profession</th>
              <th>Experience</th>
              <th>Goals & Interests</th>
              <th>Physical Restrictions</th>
              <th>Morning Commitment (5:15-6:15 AM)</th>
              <th>Guidance Comfort</th>
              <th>Found Via</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredList
              .map(
                (r, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${r.fullName}</strong></td>
                <td>${r.age}</td>
                <td>${r.whatsappNumber}</td>
                <td>${r.email}</td>
                <td>${r.profession}${r.professionOther ? ` (${r.professionOther})` : ""}</td>
                <td>${r.yogaExperience}</td>
                <td>${(r.goals || []).join(", ")}${r.goalsOther ? ` [Other: ${r.goalsOther}]` : ""}${r.hopesToGain ? `<br><em>Note: ${r.hopesToGain}</em>` : ""}</td>
                <td class="${r.hasPhysicalRestrictions === "Yes" ? "warning" : ""}">${r.hasPhysicalRestrictions}${r.physicalRestrictionsDetail ? `: ${r.physicalRestrictionsDetail}` : ""}</td>
                <td class="${r.morningCommitment.includes("committed") ? "highlight" : ""}">${r.morningCommitment}</td>
                <td>${r.comfortableFollowingGuidance}</td>
                <td>${r.hearAbout || "N/A"}${r.hearAboutOther ? ` (${r.hearAboutOther})` : ""}</td>
                <td>${new Date(r.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Mivora_Yoga_Registrations_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredList.length} registrations as Excel`);
  };

  // EXPORT AS PDF / PRINT REPORT
  const handleExportPDF = () => {
    if (filteredList.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to open the PDF print view");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mivora Academy - 14-Day Free Yoga Program Registrations</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; margin: 0; padding: 15px; font-size: 11px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand { font-size: 20px; font-weight: 800; color: #064e3b; letter-spacing: -0.5px; }
          .sub { font-size: 13px; color: #059669; font-weight: 600; margin-top: 2px; }
          .meta { font-size: 10px; color: #64748b; text-align: right; }
          .stats-bar { display: flex; gap: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 15px; margin-bottom: 16px; }
          .stat-item { flex: 1; }
          .stat-label { font-size: 9px; text-transform: uppercase; color: #166534; font-weight: 700; letter-spacing: 0.5px; }
          .stat-val { font-size: 16px; font-weight: 800; color: #14532d; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
          th { background-color: #047857; color: #ffffff; text-align: left; padding: 7px 8px; font-weight: 600; border: 1px solid #047857; }
          td { border: 1px solid #e2e8f0; padding: 6px 8px; vertical-align: top; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; background: #e2e8f0; }
          .badge-green { background: #dcfce7; color: #15803d; }
          .badge-orange { background: #ffedd5; color: #c2410c; }
          .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">🌿 MIVORA ACADEMY</div>
            <div class="sub">14-Day Free Yoga Program • 04 Oct – 17 Oct 2026 (5:15 AM – 6:15 AM)</div>
          </div>
          <div class="meta">
            <div><strong>Report:</strong> Official Participant Roster</div>
            <div><strong>Generated:</strong> ${new Date().toLocaleString("en-IN")}</div>
            <div><strong>Total Participants:</strong> ${filteredList.length}</div>
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-label">Total Registered</div>
            <div class="stat-val">${filteredList.length}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Committed Attendees</div>
            <div class="stat-val">${filteredList.filter((x) => x.morningCommitment.includes("committed")).length}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">New to Yoga</div>
            <div class="stat-val">${filteredList.filter((x) => x.yogaExperience.toLowerCase().includes("never")).length}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Physical Restrictions</div>
            <div class="stat-val">${filteredList.filter((x) => x.hasPhysicalRestrictions === "Yes").length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px;">#</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>WhatsApp Number</th>
              <th>Email</th>
              <th>Profession</th>
              <th>Experience</th>
              <th>Goals & Focus</th>
              <th>Restrictions</th>
              <th>Commitment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredList
              .map(
                (r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${r.fullName}</strong></td>
                <td>${r.age}</td>
                <td>${r.whatsappNumber}</td>
                <td>${r.email}</td>
                <td>${r.profession}</td>
                <td>${r.yogaExperience.replace(" — I'm completely new to yoga", " (Beginner)")}</td>
                <td>${(r.goals || []).slice(0, 3).join(", ")}${r.goals.length > 3 ? ` +${r.goals.length - 3}` : ""}</td>
                <td>
                  ${
                    r.hasPhysicalRestrictions === "Yes"
                      ? `<span class="badge badge-orange">Yes: ${r.physicalRestrictionsDetail || "Noted"}</span>`
                      : `<span class="badge badge-green">No</span>`
                  }
                </td>
                <td><span class="badge ${r.morningCommitment.includes("committed") ? "badge-green" : ""}">${r.morningCommitment}</span></td>
                <td>${new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Mivora Academy • Phone / WhatsApp: 9043380133 • Email: mivoraacademy@gmail.com • Breathe. Move. Begin.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(
      `Namaste ${name}! 🌿 Welcome to Mivora Academy 14-Day Free Yoga Program (04–17 October 2026, 5:15 AM – 6:15 AM). Here is your session access details:`
    );
    window.open(`https://wa.me/${finalPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Mivora Academy"
            className="h-14 w-14 rounded-2xl object-cover border border-border shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-emerald font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Mivora Academy Registration Portal</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mt-0.5">
              14-Day Yoga Program Registrations
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              04 Oct – 17 Oct 2026 • 5:15 AM – 6:15 AM Daily • Live Online
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {/* Export Actions Menu */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs border-emerald/40 hover:bg-emerald/10 text-emerald font-medium"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="gap-1.5 text-xs border-primary/40 hover:bg-primary/10 text-primary font-medium"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Excel (.xls)</span>
          </Button>

          <Button
            size="sm"
            onClick={handleExportPDF}
            className="gap-1.5 text-xs bg-emerald text-emerald-foreground hover:bg-emerald/90 font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Registered</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
            {statsData?.total ?? registrations.length}
          </p>
          <span className="text-[11px] text-muted-foreground">Active participants roster</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">100% Committed</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald/15 text-emerald">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-emerald mt-2">
            {statsData?.committed ?? registrations.filter((r) => r.morningCommitment.includes("committed")).length}
          </p>
          <span className="text-[11px] text-muted-foreground">Ready for 14 daily sessions</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First-time Beginners</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-orange/15 text-orange">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-orange mt-2">
            {statsData?.beginners ?? registrations.filter((r) => r.yogaExperience.toLowerCase().includes("never")).length}
          </p>
          <span className="text-[11px] text-muted-foreground">New to morning yoga</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Physical Notes</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/15 text-destructive">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
            {statsData?.withRestrictions ?? registrations.filter((r) => r.hasPhysicalRestrictions === "Yes").length}
          </p>
          <span className="text-[11px] text-muted-foreground">Require gentle modifications</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Profession Filter */}
          <Select value={professionFilter} onValueChange={setProfessionFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Working Professional">Working Professional</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Homemaker">Homemaker</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Experience Filter */}
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Yoga Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience Levels</SelectItem>
              <SelectItem value="Never">Never (Beginner)</SelectItem>
              <SelectItem value="Occasionally">Occasionally</SelectItem>
              <SelectItem value="Regularly">Regularly</SelectItem>
            </SelectContent>
          </Select>

          {/* Commitment Filter */}
          <Select value={commitmentFilter} onValueChange={setCommitmentFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Commitment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commitment Levels</SelectItem>
              <SelectItem value="committed">Committed 🙌</SelectItem>
              <SelectItem value="possible">As Often As Possible</SelectItem>
              <SelectItem value="sure">Not Sure Yet</SelectItem>
            </SelectContent>
          </Select>

          {/* Restrictions Filter */}
          <Select value={restrictionFilter} onValueChange={setRestrictionFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Restrictions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Health Statuses</SelectItem>
              <SelectItem value="No">No Restrictions</SelectItem>
              <SelectItem value="Yes">Has Restrictions (Yes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter count indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
          <span>
            Showing <strong>{filteredList.length}</strong> of <strong>{registrations.length}</strong> registrations
          </span>
          {(searchTerm || professionFilter !== "all" || experienceFilter !== "all" || commitmentFilter !== "all" || restrictionFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setProfessionFilter("all");
                setExperienceFilter("all");
                setCommitmentFilter("all");
                setRestrictionFilter("all");
              }}
              className="h-7 text-xs text-primary gap-1"
            >
              <X className="h-3 w-3" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Table View */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="w-12 text-xs font-bold">#</TableHead>
                <TableHead className="text-xs font-bold">Name &amp; Age</TableHead>
                <TableHead className="text-xs font-bold">WhatsApp / Phone</TableHead>
                <TableHead className="text-xs font-bold">Email</TableHead>
                <TableHead className="text-xs font-bold">Profession</TableHead>
                <TableHead className="text-xs font-bold">Experience</TableHead>
                <TableHead className="text-xs font-bold">Goals &amp; Interests</TableHead>
                <TableHead className="text-xs font-bold">Health / Restrictions</TableHead>
                <TableHead className="text-xs font-bold">Commitment</TableHead>
                <TableHead className="text-xs font-bold">Registered</TableHead>
                <TableHead className="text-right text-xs font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={11} className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                      Loading registered participants...
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-8 text-center text-sm text-destructive">
                    Failed to fetch registrations. Please check backend connection.
                  </TableCell>
                </TableRow>
              ) : filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-12 text-center text-sm text-muted-foreground">
                    No registrations found matching the current search / filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((user, idx) => (
                  <TableRow key={user._id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs font-semibold text-muted-foreground">{idx + 1}</TableCell>

                    <TableCell>
                      <div className="font-semibold text-sm text-foreground">{user.fullName}</div>
                      <span className="text-xs text-muted-foreground">{user.age} yrs</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-foreground">{user.whatsappNumber}</span>
                        <button
                          title="Message on WhatsApp"
                          onClick={() => openWhatsApp(user.whatsappNumber, user.fullName)}
                          className="grid h-6 w-6 place-items-center rounded-md bg-emerald/15 text-emerald hover:bg-emerald/30 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors truncate max-w-[150px] inline-block"
                        title={user.email}
                      >
                        {user.email}
                      </a>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium text-foreground">
                        {user.profession}
                        {user.professionOther && ` (${user.professionOther})`}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${
                          user.yogaExperience.toLowerCase().includes("never")
                            ? "bg-orange/10 text-orange border-orange/30"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        {user.yogaExperience.toLowerCase().includes("never") ? "Beginner" : user.yogaExperience}
                      </Badge>
                    </TableCell>

                    <TableCell className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {(user.goals || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {g}
                          </span>
                        ))}
                        {(user.goals || []).length > 2 && (
                          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            +{(user.goals || []).length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {user.hasPhysicalRestrictions === "Yes" ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                          title={user.physicalRestrictionsDetail}
                        >
                          <Badge variant="destructive" className="text-[10px] gap-1">
                            <ShieldAlert className="h-3 w-3" />
                            <span>Yes</span>
                          </Badge>
                          {user.physicalRestrictionsDetail && (
                            <p className="text-[10px] text-muted-foreground truncate max-w-[120px] mt-0.5">
                              {user.physicalRestrictionsDetail}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-emerald/10 text-emerald border-emerald/30">
                          No
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          user.morningCommitment.includes("committed")
                            ? "bg-emerald text-emerald-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {user.morningCommitment.includes("committed") ? "Committed 🙌" : "Flexible"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          title="View Full Details"
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserToDelete(user)}
                          title="Delete Registration"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog for Single Registration */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-emerald text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>Participant Details</span>
                </div>
                <DialogTitle className="font-display text-2xl font-bold text-foreground">
                  {selectedUser.fullName}
                </DialogTitle>
                <DialogDescription>
                  Registered on {new Date(selectedUser.createdAt).toLocaleString("en-IN")}
                </DialogDescription>
              </DialogHeader>

              {/* Quick Contact Bar */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => openWhatsApp(selectedUser.whatsappNumber, selectedUser.fullName)}
                  className="bg-emerald text-emerald-foreground hover:bg-emerald/90 gap-1.5 text-xs"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Chat on WhatsApp ({selectedUser.whatsappNumber})</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="text-xs"
                >
                  <a href={`mailto:${selectedUser.email}`}>
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    <span>Send Email</span>
                  </a>
                </Button>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Age &amp; Profession</span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedUser.age} years old • {selectedUser.profession}
                    {selectedUser.professionOther && ` (${selectedUser.professionOther})`}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Yoga Experience</span>
                  <p className="text-sm font-medium text-foreground">{selectedUser.yogaExperience}</p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1 sm:col-span-2">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Goals to Improve</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(selectedUser.goals || []).map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                    {selectedUser.goalsOther && (
                      <Badge variant="outline" className="text-xs text-primary border-primary">
                        Other: {selectedUser.goalsOther}
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedUser.hopesToGain && (
                  <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1 sm:col-span-2">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px]">Hopes to Gain / Note</span>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{selectedUser.hopesToGain}"
                    </p>
                  </div>
                )}

                <div className={`rounded-xl border p-3 space-y-1 sm:col-span-2 ${
                  selectedUser.hasPhysicalRestrictions === "Yes"
                    ? "border-orange/50 bg-orange/10"
                    : "border-border bg-secondary/30"
                }`}>
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Physical Restrictions / Safety</span>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedUser.hasPhysicalRestrictions === "Yes" ? "⚠️ Yes — Physical Restrictions" : "✅ No Restrictions"}
                  </p>
                  {selectedUser.physicalRestrictionsDetail && (
                    <p className="text-xs text-foreground mt-1">
                      <strong>Details:</strong> {selectedUser.physicalRestrictionsDetail}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Morning Attendance Commitment</span>
                  <p className="text-sm font-medium text-foreground">{selectedUser.morningCommitment}</p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Follows Guidance</span>
                  <p className="text-sm font-medium text-foreground">{selectedUser.comfortableFollowingGuidance}</p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">How Found Us</span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedUser.hearAbout || "N/A"}
                    {selectedUser.hearAboutOther && ` (${selectedUser.hearAboutOther})`}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px]">Future Updates</span>
                  <p className="text-sm font-medium text-foreground">{selectedUser.futureUpdates || "Not specified"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">Delete Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the registration for <strong>{userToDelete?.fullName}</strong> ({userToDelete?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => userToDelete && deleteMutation.mutate(userToDelete._id)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
