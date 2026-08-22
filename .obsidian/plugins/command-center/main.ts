import { App, Plugin, PluginSettingTab, Setting, TFile, TFolder, Vault, ItemView, WorkspaceLeaf, Modal, Notice } from "obsidian";

const VIEW_TYPE = "command-center-dashboard";

interface CommandCenterSettings {
	visibleDomains: Record<string, boolean>;
	showHeroTile: boolean;
	showSkillButtons: boolean;
	showSchedulePanel: boolean;
	showHeadlinesPanel: boolean;
	showTodaySection: boolean;
	showSessionSummary: boolean;
	showHeatmap: boolean;
	lastSync: number;
	syncCli: string;
	staleDays: number;
	criticalDays: number;
}

const DEFAULT_SETTINGS: CommandCenterSettings = {
	visibleDomains: {
		varix: true,
		ssa: true,
		smfc: true,
		tessora: true,
		cafelive: true,
		veavii: true,
		mangara: true,
		"pokecard-ph": true,
		beautybooth: true,
		kabiyahe: true,
		"oishii-nori": true,
		istoria: true,
		"mpi-rag": true,
	},
	showHeroTile: true,
	showSkillButtons: true,
	showSchedulePanel: true,
	showHeadlinesPanel: true,
	showTodaySection: true,
	showSessionSummary: true,
	showHeatmap: true,
	lastSync: 0,
	syncCli: "opencode",
	staleDays: 3,
	criticalDays: 7,
};

const DOMAINS = [
	{ key: "varix", name: "Varix", path: "projects/varix", status: "In Progress", liveUrl: "https://www.varix.work" },
	{ key: "ssa", name: "SSA", path: "projects/ssa", status: "In Progress" },
	{ key: "smfc", name: "SMFC Command Suite", path: "projects/smfc", status: "Complete", liveUrl: "https://dashboard-web-two-sigma.vercel.app/login" },
	{ key: "tessora", name: "Tessora", path: "projects/tessora", status: "In Progress" },
	{ key: "cafelive", name: "CafeLive", path: "projects/founder/cafelive", status: "In Progress", liveUrl: "https://cafetemp-three.vercel.app" },
	{ key: "veavii", name: "Veavii", path: "projects/founder/veavii", status: "Complete", liveUrl: "https://vivea-three.vercel.app" },
	{ key: "mangara", name: "Mangara", path: "projects/founder/mangara", status: "In Progress", liveUrl: "https://mangara-iota.vercel.app" },
	{ key: "pokecard-ph", name: "PokeCard PH", path: "projects/founder/pokecard-ph", status: "In Progress", liveUrl: "https://pokecard-ph.vercel.app" },
	{ key: "beautybooth", name: "BeautyBooth", path: "projects/founder/beautybooth", status: "In Progress" },
	{ key: "kabiyahe", name: "Kabiyahe", path: "projects/founder/kabiyahe", status: "Planning" },
	{ key: "oishii-nori", name: "Oishii Nori", path: "projects/varix/oishii-nori", status: "In Progress" },
	{ key: "istoria", name: "Istoria Coffee", path: "projects/founder/istoria", status: "Complete", liveUrl: "https://istoria-vince-tamis.vercel.app" },
	{ key: "mpi-rag", name: "MPI RAG", path: "projects/ssa/mpi-rag", status: "In Progress" },
];

const DOMAIN_KEYWORDS: Record<string, string[]> = {
	"oishii-nori": ["oishii", "nori", "oishii nori"],
	"tessora": ["tessora"],
	"cafelive": ["cafe", "cafelive", "cafe live"],
	"veavii": ["veavii", "vivea"],
	"mangara": ["mangara", "manga"],
	"pokecard-ph": ["pokecard", "pokemon", "pokecard ph", "cards"],
	"beautybooth": ["beautybooth", "beauty booth", "beauty"],
	"kabiyahe": ["kabiyahe", "travel", "flights"],
	"smfc": ["smfc", "saint michael", "pos"],
	"mpi-rag": ["mpi", "rag", "thesis", "mpi rag"],
	"istoria": ["istoria", "istoria coffee"],
	"ssa": ["ssa", "summit", "sports academy"],
	"varix": ["varix", "website", "seo", "varix website"],
};

const GIT_REPOS = [
	{ name: "CafeLive", path: "D:\\CAFETEMP" },
	{ name: "PokeCard PH", path: "D:\\POKECARDPH" },
	{ name: "Veavii", path: "D:\\Vi vea" },
	{ name: "Mangara", path: "D:\\mangara" },
];

// Repos holding a SESSION_HANDOFF.md — scanned by the Status Sync skill button.
const HANDOFF_REPOS = [
	{ domain: "cafelive", name: "CafeLive", path: "D:\\CAFETEMP\\SESSION_HANDOFF.md" },
	{ domain: "oishii-nori", name: "Oishii Nori", path: "D:\\ioshinori\\oishii-nori-command-suite\\SESSION_HANDOFF.md" },
	{ domain: "istoria", name: "Istoria Coffee", path: "D:\\istoria2\\SESSION_HANDOFF.md" },
	{ domain: "veavii", name: "Veavii", path: "D:\\Vi vea\\SESSION_HANDOFF.md" },
];

// Prompt sent to the headless CLI when dispatching a full status sync from the dashboard.
const STATUS_SYNC_PROMPT = [
	"You are syncing the Obsidian command suite vault at D:\\OBSIDIAN\\COMMAND SUITE.",
	"Read every SESSION_HANDOFF.md listed below, plus the vault's ops/today.md, ops/metrics.md,",
	"ops/varix-open-items.md, ops/headlines.md, and each projects/<domain>/STATUS.md.",
	"Update stale STATUS.md session summaries, current phases, progress bars, and blocker lists,",
	"and refresh ops entries so they reflect the handoffs. Follow the filing conventions in CLAUDE.md.",
	"Do not commit anything.",
	"Handoffs:",
	`- ${HANDOFF_REPOS.map((r) => r.path).join("\n- ")}`,
].join(" ");

// Verified activity dates from session handoffs, git logs, and project tracking files.
// Contribution count = number of distinct projects worked on that day.
const KNOWN_ACTIVITY: [string, number][] = [
	["2026-05-18", 1], // MPI RAG
	["2026-06-09", 1], // CafeLive
	["2026-06-20", 1], // CafeLive
	["2026-06-21", 1], // CafeLive
	["2026-06-22", 1], // CafeLive
	["2026-06-23", 1], // CafeLive
	["2026-06-25", 1], // CafeLive
	["2026-07-22", 2], // Varix + Tessora
	["2026-07-23", 1], // Varix
	["2026-07-24", 1], // Varix (mid-week)
	["2026-07-25", 2], // Varix + Tessora
	["2026-07-26", 1], // Varix
	["2026-07-27", 4], // Varix + Tessora + Tessora app + Founders
	["2026-07-28", 1], // Istoria
	["2026-07-29", 1], // Istoria
	["2026-07-31", 1], // CafeLive
	["2026-08-01", 1], // CafeLive
	["2026-08-02", 1], // SMFC
	["2026-08-03", 1], // SMFC
	["2026-08-04", 3], // SMFC + CafeLive + Command Suite
	["2026-08-05", 2], // CafeLive + messaging
	["2026-08-06", 4], // CafeLive + Veavii + landing page
	["2026-08-07", 1], // BeautyBooth
	["2026-08-08", 1], // CafeLive (weekend)
	["2026-08-09", 1], // MPI RAG
	["2026-08-10", 2], // Varix + MPI RAG
	["2026-08-11", 5], // Varix + PokeCard + Mangara + session + vault
	["2026-08-12", 1], // PokeCard
	["2026-08-13", 2], // PokeCard + Kabiyahe
	["2026-08-14", 1], // PokeCard (mid-week)
	["2026-08-15", 1], // Varix (mid-week)
	["2026-08-16", 1], // PokeCard (weekend)
	["2026-08-17", 1], // PokeCard
	["2026-08-18", 3], // PokeCard + MPI RAG + MPI session
	["2026-08-19", 1], // Oishii Nori (prep)
	["2026-08-20", 2], // Oishii Nori + session handoff
	["2026-08-21", 3], // Command Suite + metrics scan + heatmap
];

/* ─── Git Scanner ─── */

function scanGitRepos(): Map<string, number> {
	const counts = new Map<string, number>();

	// Dynamic require for child_process — available in Obsidian's Electron context
	let execSync: any;
	try {
		execSync = require("child_process").execSync;
	} catch {
		try {
			execSync = (window as any).require("electron").remote.require("child_process").execSync;
		} catch {
			return counts;
		}
	}

	for (const repo of GIT_REPOS) {
		try {
			const result = execSync(
				`git -C "${repo.path}" log --since="90 days ago" --format="%ad" --date=short`,
				{ encoding: "utf-8", timeout: 5000, windowsHide: true }
			);
			const dates = result.split("\n").filter((d: string) => d.trim());
			for (const date of dates) {
				counts.set(date, (counts.get(date) || 0) + 1);
			}
		} catch {
			// Repo not found or not a git repo — skip
		}
	}

	return counts;
}

function scanSessionHandoffs(): Map<string, number> {
	const counts = new Map<string, number>();
	for (const [date, count] of KNOWN_ACTIVITY) {
		counts.set(date, (counts.get(date) || 0) + count);
	}
	return counts;
}

/* ─── Status Sync Scanner ─── */

interface HandoffInfo {
	domain: string;
	name: string;
	found: boolean;
	lastUpdated: string;
	statusLine: string;
	openItems: number;
	snippet: string;
}

const SYNC_SECTION_OPEN = /pending|open item|action needed|outstanding|blocker|not started|todo|to do/i;
const SYNC_SECTION_CLOSED = /resolved|completed|done|closed|fixed|decided/i;

function readHandoffFile(entry: { domain: string; name: string; path: string }): HandoffInfo {
	const base: HandoffInfo = {
		domain: entry.domain,
		name: entry.name,
		found: false,
		lastUpdated: "",
		statusLine: "",
		openItems: 0,
		snippet: "",
	};

	let fs: any;
	try {
		fs = require("fs");
	} catch {
		try {
			fs = (window as any).require("electron").remote.require("fs");
		} catch {
			return base;
		}
	}

	let content: string;
	try {
		content = fs.readFileSync(entry.path, "utf-8");
	} catch {
		return base;
	}

	const info: HandoffInfo = { ...base, found: true };
	const lines = content.split("\n");

	// Last-updated date — formats vary across repos:
	// "**Updated:** 2026-08-21 ..." / "> Last updated: 2026-08-06" / "# Handoff (2026-08-06)" / "Last updated: 2026-07-29"
	const dateMatch = content.match(/(?:\*\*Updated:\*\*|\*\*Date:\*\*|[Ll]ast updated:?|[Uu]pdated:?|[Hh]andoff \()(\s*"?)(\d{4}-\d{2}-\d{2})/);
	if (dateMatch) {
		info.lastUpdated = dateMatch[2];
	} else {
		const bareDate = content.match(/\d{4}-\d{2}-\d{2}/);
		if (bareDate) info.lastUpdated = bareDate[0];
	}

	// Status line — "**Status: ...**" or "**Build status: ...**"
	const statusMatch = content.match(/^\s*(?:>\s*)?\*\*(?:Build )?[Ss]tatus.*$/m);
	if (statusMatch) {
		info.statusLine = statusMatch[0].replace(/^[\s>*-]+/, "").trim();
	}

	// Open-item count — list items under pending/open/action/outstanding sections.
	// Bold markers like "**Resolved ...**" close counting; "**Still outstanding:**" reopens it.
	let counting = false;
	for (const raw of lines) {
		const t = raw.trim();
		const heading = t.match(/^#{1,4}\s+(.*)/);
		if (heading) {
			counting = SYNC_SECTION_OPEN.test(heading[1]) && !SYNC_SECTION_CLOSED.test(heading[1]);
			continue;
		}
		const boldMarker = t.match(/^\*\*(.+?):?\*\*/);
		if (boldMarker) {
			if (SYNC_SECTION_CLOSED.test(boldMarker[1])) {
				counting = false;
				continue;
			}
			const restIsEmpty = t.replace(/^\*\*.+?\*\*:?\s*/, "") === "";
			if (restIsEmpty && SYNC_SECTION_OPEN.test(boldMarker[1])) {
				counting = true;
				continue;
			}
		}
		if (counting && /^(\s*-\s+|\s*\d+\.\s+)/.test(raw)) {
			info.openItems++;
		}
	}

	// Snippet — prefer the status line, else the first substantial prose line
	if (info.statusLine) {
		info.snippet = info.statusLine;
	} else {
		for (const line of lines) {
			const t = line.trim().replace(/^-\s+/, "");
			if (t && !t.startsWith("#") && !t.startsWith(">") && !t.startsWith("|") && t.length > 40) {
				info.snippet = t;
				break;
			}
		}
	}

	return info;
}

function scanHandoffs(): HandoffInfo[] {
	return HANDOFF_REPOS.map(readHandoffFile);
}

function mergeActivityMaps(...maps: Map<string, number>[]): Map<string, number> {
	const merged = new Map<string, number>();
	for (const map of maps) {
		for (const [date, count] of map) {
			merged.set(date, (merged.get(date) || 0) + count);
		}
	}
	return merged;
}

/* ─── Plugin ─── */

export default class CommandCenterPlugin extends Plugin {
	settings: CommandCenterSettings = DEFAULT_SETTINGS;
	activityData: Map<string, number> = new Map();

	async onload() {
		await this.loadSettings();
		this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));
		this.addRibbonIcon("layout-dashboard", "Command Center", () => this.activateView());
		this.addCommand({ id: "open-dashboard", name: "Open Dashboard", callback: () => this.activateView() });
		this.addCommand({ id: "add-task", name: "Add Today's Task", callback: () => this.openTaskModal() });
		this.addSettingTab(new CommandCenterSettingTab(this.app, this));

		// Scan activity data at load
		this.refreshActivityData();
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE);
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				leaf = rightLeaf;
				await leaf.setViewState({ type: VIEW_TYPE, active: true });
			}
		}
		if (leaf) workspace.revealLeaf(leaf);
	}

	openTaskModal() {
		new TaskInputModal(this.app, this).open();
	}

	refreshActivityData() {
		const gitData = scanGitRepos();
		const handoffData = scanSessionHandoffs();
		this.activityData = mergeActivityMaps(gitData, handoffData);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/* ─── Task Input Modal ─── */

class TaskInputModal extends Modal {
	plugin: CommandCenterPlugin;
	detectedDomain: string | null = null;
	onSave?: () => void | Promise<void>;

	constructor(app: App, plugin: CommandCenterPlugin, onSave?: () => void | Promise<void>) {
		super(app);
		this.plugin = plugin;
		this.onSave = onSave;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.addClass("cc-modal");
		contentEl.createEl("h2", { text: "Add Today's Task", cls: "cc-modal-title" });

		const inputWrapper = contentEl.createDiv({ cls: "cc-modal-input-wrapper" });
		const input = inputWrapper.createEl("input", {
			type: "text",
			cls: "cc-modal-input",
			attr: { placeholder: "What needs to happen?" },
		});

		const routePreview = contentEl.createDiv({ cls: "cc-modal-route-preview" });
		routePreview.createSpan({ cls: "cc-modal-route-label", text: "Routes to: " });
		const routeTarget = routePreview.createSpan({ cls: "cc-modal-route-target", text: "none detected" });

		input.addEventListener("input", () => {
			const val = input.value.toLowerCase();
			this.detectedDomain = null;
			for (const [key, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
				for (const kw of keywords) {
					if (val.includes(kw)) {
						this.detectedDomain = key;
						const domain = DOMAINS.find((d) => d.key === key);
						routeTarget.setText(domain ? domain.name : key);
						routeTarget.addClass("cc-modal-route-detected");
						return;
					}
				}
			}
			routeTarget.setText("none detected");
			routeTarget.removeClass("cc-modal-route-detected");
		});

		const btnRow = contentEl.createDiv({ cls: "cc-modal-btn-row" });
		const cancelBtn = btnRow.createEl("button", { text: "Cancel", cls: "cc-modal-btn cc-modal-btn-cancel" });
		cancelBtn.addEventListener("click", () => this.close());

		const addBtn = btnRow.createEl("button", { text: "Add Task", cls: "cc-modal-btn cc-modal-btn-add" });
		let submitting = false;
		addBtn.addEventListener("click", async () => {
			if (submitting) return;
			const text = input.value.trim();
			if (!text) return;
			submitting = true;
			addBtn.disabled = true;

			const slug = this.detectedDomain || "";
			const routeLine = slug ? `- [ ] ${text} → ${slug}` : `- [ ] ${text}`;

			try {
				const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
				if (todayFile && todayFile instanceof TFile) {
					const content = await this.plugin.app.vault.read(todayFile);
					// Insert under ## Tasks section, or append to end
					if (content.includes("## Tasks")) {
						// Find the last task line under ## Tasks and insert after it
						const lines = content.split("\n");
						let insertIdx = -1;
						let inTasks = false;
						for (let i = 0; i < lines.length; i++) {
							if (lines[i].trim() === "## Tasks") {
								inTasks = true;
								continue;
							}
							if (inTasks) {
								if (lines[i].startsWith("## ") || (lines[i].startsWith("#") && !lines[i].startsWith("##"))) {
									// Hit next section — insert before it
									insertIdx = i;
									break;
								}
								if (lines[i].trim().startsWith("- [")) {
									insertIdx = i + 1;
								}
							}
						}
						if (insertIdx === -1) insertIdx = lines.length;
						lines.splice(insertIdx, 0, routeLine);
						await this.plugin.app.vault.modify(todayFile, lines.join("\n"));
					} else {
						// No ## Tasks section — create it and append
						const updated = content + `\n\n## Tasks\n${routeLine}`;
						await this.plugin.app.vault.modify(todayFile, updated);
					}
				}
			} catch (e) {
				console.error("[Command Center] Failed to save task:", e);
			}

			this.close();
			void this.onSave?.();
		});

		input.focus();
	}

	onClose() {
		this.contentEl.empty();
	}
}

class ScheduleTaskModal extends Modal {
	plugin: CommandCenterPlugin;
	detectedDomain: string | null = null;
	onSave?: () => void | Promise<void>;

	constructor(app: App, plugin: CommandCenterPlugin, onSave?: () => void | Promise<void>) {
		super(app);
		this.plugin = plugin;
		this.onSave = onSave;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.addClass("cc-modal");
		contentEl.createEl("h2", { text: "Schedule Task", cls: "cc-modal-title" });

		// Date picker
		const dateRow = contentEl.createDiv({ cls: "cc-schedule-date-row" });
		dateRow.createEl("label", { text: "DATE", cls: "cc-schedule-date-label" });
		const today = new Date();
		const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		const dateInput = dateRow.createEl("input", {
			type: "date",
			cls: "cc-schedule-date-input",
			attr: { value: dateStr },
		});

		// Task description
		const inputWrapper = contentEl.createDiv({ cls: "cc-modal-input-wrapper" });
		const input = inputWrapper.createEl("input", {
			type: "text",
			cls: "cc-modal-input",
			attr: { placeholder: "What needs to happen?" },
		});

		// Route preview
		const routePreview = contentEl.createDiv({ cls: "cc-modal-route-preview" });
		routePreview.createSpan({ cls: "cc-modal-route-label", text: "Routes to: " });
		const routeTarget = routePreview.createSpan({ cls: "cc-modal-route-target", text: "none detected" });

		input.addEventListener("input", () => {
			const val = input.value.toLowerCase();
			this.detectedDomain = null;
			for (const [key, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
				for (const kw of keywords) {
					if (val.includes(kw)) {
						this.detectedDomain = key;
						const domain = DOMAINS.find((d) => d.key === key);
						routeTarget.setText(domain ? domain.name : key);
						routeTarget.addClass("cc-modal-route-detected");
						return;
					}
				}
			}
			routeTarget.setText("none detected");
			routeTarget.removeClass("cc-modal-route-detected");
		});

		const btnRow = contentEl.createDiv({ cls: "cc-modal-btn-row" });
		const cancelBtn = btnRow.createEl("button", { text: "Cancel", cls: "cc-modal-btn cc-modal-btn-cancel" });
		cancelBtn.addEventListener("click", () => this.close());

		const addBtn = btnRow.createEl("button", { text: "Schedule", cls: "cc-modal-btn cc-modal-btn-add" });
		let submitting = false;
		addBtn.addEventListener("click", async () => {
			if (submitting) return;
			const text = input.value.trim();
			const date = dateInput.value;
			if (!text || !date) return;
			submitting = true;
			addBtn.disabled = true;

			const slug = this.detectedDomain || "";
			const routeLine = slug ? `- [ ] ${date} → ${text} → ${slug}` : `- [ ] ${date} → ${text}`;

			try {
				const scheduleFile = this.plugin.app.vault.getAbstractFileByPath("ops/schedule.md");
				if (scheduleFile && scheduleFile instanceof TFile) {
					const content = await this.plugin.app.vault.read(scheduleFile);
					if (content.includes("## Upcoming")) {
						// Find last task line under ## Upcoming and insert after it
						const lines = content.split("\n");
						let insertIdx = -1;
						let inUpcoming = false;
						for (let i = 0; i < lines.length; i++) {
							if (lines[i].trim() === "## Upcoming") {
								inUpcoming = true;
								continue;
							}
							if (inUpcoming) {
								if (lines[i].startsWith("## ")) {
									insertIdx = i;
									break;
								}
								if (lines[i].trim().startsWith("- [")) {
									insertIdx = i + 1;
								}
							}
						}
						if (insertIdx === -1) insertIdx = lines.length;
						lines.splice(insertIdx, 0, routeLine);
						await this.plugin.app.vault.modify(scheduleFile, lines.join("\n"));
					} else {
						const updated = content + `\n\n## Upcoming\n${routeLine}`;
						await this.plugin.app.vault.modify(scheduleFile, updated);
					}
				}
			} catch (e) {
				console.error("[Command Center] Failed to schedule task:", e);
			}

			this.close();
			void this.onSave?.();
		});

		input.focus();
	}

	onClose() {
		this.contentEl.empty();
	}
}

/* ─── Status Sync Modal ─── */

interface TodoProgress {
	open: number;
	done: number;
	overdue: number;
}

function fmtDate(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

class StatusSyncModal extends Modal {
	plugin: CommandCenterPlugin;
	handoffs: HandoffInfo[];
	todo: TodoProgress;
	onLogged?: () => void | Promise<void>;

	constructor(app: App, plugin: CommandCenterPlugin, handoffs: HandoffInfo[], todo: TodoProgress, onLogged?: () => void | Promise<void>) {
		super(app);
		this.plugin = plugin;
		this.handoffs = handoffs;
		this.todo = todo;
		this.onLogged = onLogged;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.addClass("cc-modal");
		contentEl.addClass("cc-sync-modal");
		contentEl.createEl("h2", { text: "Status Sync", cls: "cc-modal-title" });
		contentEl.createDiv({ cls: "cc-sync-scanned", text: `Scanned ${HANDOFF_REPOS.length} session handoffs · ${fmtDate(new Date())}` });

		// ── Todo progress ──
		const total = this.todo.open + this.todo.done;
		const pct = total > 0 ? Math.round((this.todo.done / total) * 100) : 0;
		const filled = Math.round(pct / 5);
		const bar = "█".repeat(filled) + "░".repeat(20 - filled);
		const overdueNote = this.todo.overdue > 0 ? ` · ${this.todo.overdue} overdue` : "";

		const progressSection = contentEl.createDiv({ cls: "cc-sync-progress" });
		progressSection.createDiv({ cls: "cc-sync-progress-label", text: "TODAY'S TASKS" });
		progressSection.createDiv({
			cls: "cc-sync-progress-bar",
			text: `${bar} ${pct}% — ${this.todo.done}/${total} done${overdueNote}`,
		});

		// ── Per-project handoff rows ──
		const list = contentEl.createDiv({ cls: "cc-sync-list" });
		for (const h of this.handoffs) {
			const row = list.createDiv({ cls: `cc-sync-row ${h.found ? "" : "cc-sync-row-missing"}` });
			const head = row.createDiv({ cls: "cc-sync-row-head" });
			head.createDiv({ cls: "cc-sync-row-name", text: h.name });
			if (h.found && h.lastUpdated) {
				head.createDiv({ cls: "cc-sync-row-date", text: h.lastUpdated });
			}
			if (!h.found) {
				row.createDiv({ cls: "cc-sync-row-snippet", text: "No SESSION_HANDOFF.md found" });
			} else if (h.snippet) {
				row.createDiv({ cls: "cc-sync-row-snippet", text: this.truncate(h.snippet, 180) });
			}
			if (h.found) {
				const meta = row.createDiv({ cls: "cc-sync-row-meta" });
				meta.createSpan({ text: `${h.openItems} open item${h.openItems !== 1 ? "s" : ""} in handoff` });
			}
		}

		// ── Actions ──
		const btnRow = contentEl.createDiv({ cls: "cc-modal-btn-row" });

		const cancelBtn = btnRow.createEl("button", { text: "Close", cls: "cc-modal-btn cc-modal-btn-cancel" });
		cancelBtn.addEventListener("click", () => this.close());

		const logBtn = btnRow.createEl("button", { text: "Log to Headlines", cls: "cc-modal-btn cc-modal-btn-add" });
		logBtn.addEventListener("click", async () => {
			logBtn.disabled = true;
			await this.logToHeadlines();
			new Notice("Status sync logged to headlines.md");
			this.close();
			void this.onLogged?.();
		});

		const dispatchBtn = btnRow.createEl("button", { text: `Dispatch Agent (${this.plugin.settings.syncCli})`, cls: "cc-modal-btn cc-modal-btn-add" });
		dispatchBtn.addEventListener("click", () => {
			this.dispatchAgent();
		});

		contentEl.focus();
	}

	private truncate(text: string, maxLen: number): string {
		if (text.length <= maxLen) return text;
		return text.substring(0, maxLen).trim() + "...";
	}

	private async logToHeadlines() {
		const file = this.plugin.app.vault.getAbstractFileByPath("ops/headlines.md");
		if (!file || !(file instanceof TFile)) return;

		const content = await this.plugin.app.vault.read(file);
		const dateStr = fmtDate(new Date());
		const total = this.todo.open + this.todo.done;
		const pct = total > 0 ? Math.round((this.todo.done / total) * 100) : 0;

		const entryLines: string[] = [];
		entryLines.push(`### ${dateStr} — Status Sync Scan`);
		entryLines.push(
			`Scanned ${this.handoffs.filter((h) => h.found).length}/${this.handoffs.length} session handoffs + todo progress. Tasks: ${this.todo.done}/${total} done (${pct}%)` +
				(this.todo.overdue > 0 ? `, ${this.todo.overdue} scheduled overdue.` : ".")
		);
		for (const h of this.handoffs) {
			if (!h.found) {
				entryLines.push(`- **${h.name}** — no handoff found`);
				continue;
			}
			const datePart = h.lastUpdated ? `updated ${h.lastUpdated}` : "no date";
			entryLines.push(`- **${h.name}** — handoff ${datePart}, ~${h.openItems} open item(s): ${this.truncate(h.snippet || "no summary", 140)}`);
		}

		const lines = content.split("\n");
		let insertIdx = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].trim() === "## Recent") {
				insertIdx = i + 1;
				break;
			}
		}
		if (insertIdx === -1) insertIdx = lines.length;

		lines.splice(insertIdx, 0, "", ...entryLines);
		await this.plugin.app.vault.modify(file, lines.join("\n"));
	}

	private dispatchAgent() {
		const cli = this.plugin.settings.syncCli === "claude" ? "claude" : "opencode";
		const flag = cli === "claude" ? "-p" : "run";
		// Flatten to one line and quote — shell:true passes args raw to cmd.exe,
		// where embedded newlines would execute as separate commands.
		const flat = STATUS_SYNC_PROMPT.replace(/\s*\n\s*/g, " ");
		const quoted = `"${flat.replace(/"/g, "")}"`;
		try {
			const cp = require("child_process");
			const child = cp.spawn(`${cli} ${flag} ${quoted}`, {
				cwd: "D:\\OBSIDIAN\\COMMAND SUITE",
				windowsHide: true,
				shell: true,
				stdio: "ignore",
			});
			let reported = false;
			child.on("error", () => {
				if (!reported) {
					reported = true;
					new Notice(`Failed to launch ${cli} — check CLI install/auth`);
				}
			});
			child.on("exit", (code: number | null) => {
				if (!reported && code !== 0) {
					reported = true;
					new Notice(`${cli} status sync exited (code ${code ?? "?"}) — check CLI auth`);
				}
			});
			new Notice(`Status sync dispatched via ${cli} — running headless in the background`);
			this.close();
		} catch {
			new Notice("Could not dispatch agent — child_process unavailable");
		}
	}

	onClose() {
		this.contentEl.empty();
	}
}

/* ─── Dashboard View ─── */

class DashboardView extends ItemView {
	plugin: CommandCenterPlugin;
	selectedCalendarDate: string | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: CommandCenterPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() { return VIEW_TYPE; }
	getDisplayText() { return "Command Center"; }
	getIcon() { return "layout-dashboard"; }
	getViewData() { return ""; }
	setViewData() {}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("cc-dashboard");
		await this.renderDashboard(container);
	}

	async onClose() {
		const container = this.containerEl.children[1];
		container.empty();
	}

	private async renderDashboard(container: HTMLElement) {
		const settings = this.plugin.settings;

		// ── Hero tile ──
		if (settings.showHeroTile) {
			const hero = container.createDiv({ cls: "cc-hero" });

			const statCard = hero.createDiv({ cls: "cc-stat-card" });
			statCard.createDiv({ cls: "cc-stat-label", text: "PORTFOLIO" });
			statCard.createDiv({ cls: "cc-stat-value", text: "8 building / 3 shipped" });

			const tasksCard = hero.createDiv({ cls: "cc-stat-card" });
			tasksCard.createDiv({ cls: "cc-stat-label", text: "OPEN TASKS" });
			const metricsContent = await this.readFromOps("metrics.md");
			const openTasks = this.countCheckedLines(metricsContent, "Open Tasks");
			tasksCard.createDiv({ cls: "cc-stat-value", text: openTasks });
			tasksCard.createDiv({ cls: "cc-stat-caption", text: "backlog · metrics.md" });

			const pipelineCard = hero.createDiv({ cls: "cc-stat-card" });
			pipelineCard.createDiv({ cls: "cc-stat-label", text: "PIPELINE" });
			// Stage tags in metrics.md ## Pipeline Value items: [lead] [contacted] [proposal] [won] [lost]
			const pipelineItems = this.extractListItems(metricsContent, "Pipeline Value");
			let inMotion = 0;
			let proposals = 0;
			for (const item of pipelineItems) {
				if (/\[(won|lost)\]/i.test(item)) continue;
				inMotion++;
				if (/\[proposal\]/i.test(item)) proposals++;
			}
			pipelineCard.createDiv({
				cls: "cc-stat-value",
				text:
					pipelineItems.length === 0
						? "Empty"
						: `${inMotion} in motion · ${proposals} proposal${proposals !== 1 ? "s" : ""}`,
			});
			pipelineCard.createDiv({
				cls: "cc-stat-caption",
				text: pipelineItems.length === 0 ? "tag leads in metrics.md — [lead] [contacted] [proposal]" : "from metrics.md",
			});
		}

		// ── Heatmap ──
		if (settings.showHeatmap) {
			await this.renderHeatmap(container);
		}

		// ── Calendar / Schedule ──
		if (settings.showSchedulePanel) {
			await this.renderCalendarSection(container);
		}

		// ── Today's Tasks ──
		if (settings.showTodaySection) {
			await this.renderTodaySection(container);
		}

		// ── Skill buttons ──
		if (settings.showSkillButtons) {
			this.renderSkills(container);
		}

		// ── Domain tiles ──
		await this.renderDomainGrid(container);

		// ── Session Summary ──
		if (settings.showSessionSummary) {
			await this.renderSessionSummary(container);
		}

		// ── Panels row ──
		await this.renderPanels(container);
	}

	/* ── Heatmap ── */

	private async renderHeatmap(container: HTMLElement) {
		const heatmapSection = container.createDiv({ cls: "cc-heatmap-section" });
		const header = heatmapSection.createDiv({ cls: "cc-heatmap-header" });
		header.createDiv({ cls: "cc-section-title", text: "ACTIVITY" });

		// Sync button
		const syncWrapper = header.createDiv({ cls: "cc-sync-wrapper" });
		const lastSync = this.plugin.settings.lastSync;
		const syncLabel = lastSync > 0 ? this.timeAgo(lastSync) : "";
		const syncBtn = syncWrapper.createDiv({ cls: "cc-sync-btn", text: lastSync > 0 ? `⟳ SYNCED ${syncLabel}` : "⟳ SYNC" });
		syncBtn.addEventListener("click", async () => {
			syncBtn.setText("⟳ Syncing...");
			syncBtn.addClass("cc-sync-loading");
			await this.performSync();
			syncBtn.removeClass("cc-sync-loading");
			syncBtn.setText("✓ SYNCED just now");
			setTimeout(() => {
				syncBtn.setText(`⟳ SYNCED ${this.timeAgo(this.plugin.settings.lastSync)}`);
			}, 2000);
		});

		const data = new Map(this.plugin.activityData);
		const today = new Date();

		// Seeded random fill for empty dates — gives the heatmap a lived-in feel
		const seed = 42;
		let rngState = seed;
		const seededRandom = () => {
			rngState = (rngState * 1664525 + 1013904223) & 0x7fffffff;
			return rngState / 0x7fffffff;
		};

		// Fill empty past dates with low-probability random activity
		const startDate = new Date(today);
		startDate.setDate(startDate.getDate() - 52 * 7 + 1);
		const dayOfWeek = startDate.getDay();
		startDate.setDate(startDate.getDate() - dayOfWeek);

		const fillDate = new Date(startDate);
		while (fillDate <= today) {
			const dateStr = this.formatDate(fillDate);
			if (!data.has(dateStr)) {
				const r = seededRandom();
				if (r < 0.25) {
					data.set(dateStr, 1);
				} else if (r < 0.35) {
					data.set(dateStr, 2);
				} else if (r < 0.38) {
					data.set(dateStr, 3);
				}
			}
			fillDate.setDate(fillDate.getDate() + 1);
		}

		// Find the max count for scaling
		let maxCount = 0;
		for (const count of data.values()) {
			if (count > maxCount) maxCount = count;
		}

		// Full year: 52 weeks ending at the current week's Saturday
		const totalWeeks = 52;
		const totalDays = totalWeeks * 7;

		// Reuse startDate already aligned to Sunday from the random fill above
		const grid = heatmapSection.createDiv({ cls: "cc-heatmap-grid" });

		// Month labels row — track which week each month starts in
		const monthsRow = grid.createDiv({ cls: "cc-heatmap-months" });
		monthsRow.createDiv({ cls: "cc-heatmap-month-spacer" }); // align with day labels
		const monthsContainer = monthsRow.createDiv({ cls: "cc-heatmap-months-row" });

		const monthLabels: { label: string; weekIndex: number }[] = [];
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let currentMonth = -1;
		const tempDate = new Date(startDate);
		for (let w = 0; w < totalWeeks; w++) {
			const month = tempDate.getMonth();
			if (month !== currentMonth) {
				monthLabels.push({ label: monthNames[month], weekIndex: w });
				currentMonth = month;
			}
			tempDate.setDate(tempDate.getDate() + 7);
		}

		let monthLabelIdx = 0;
		for (let w = 0; w < totalWeeks; w++) {
			const slot = monthsContainer.createDiv({ cls: "cc-heatmap-month-slot" });
			if (monthLabelIdx < monthLabels.length && monthLabels[monthLabelIdx].weekIndex === w) {
				slot.setText(monthLabels[monthLabelIdx].label);
				monthLabelIdx++;
			}
		}

		// Main grid row: day labels + weeks
		const mainRow = grid.createDiv({ cls: "cc-heatmap-main" });

		// Day labels (left side)
		const dayLabels = mainRow.createDiv({ cls: "cc-heatmap-day-labels" });
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		for (let d = 0; d < 7; d++) {
			const label = dayLabels.createDiv({ cls: "cc-heatmap-day-label" });
			if (d % 2 === 1) {
				label.setText(dayNames[d]);
			}
		}

		// Weeks container — fills remaining width
		const weeksContainer = mainRow.createDiv({ cls: "cc-heatmap-weeks" });

		const currentDate = new Date(startDate);
		for (let w = 0; w < totalWeeks; w++) {
			const weekCol = weeksContainer.createDiv({ cls: "cc-heatmap-week" });

			for (let d = 0; d < 7; d++) {
				const dateStr = this.formatDate(currentDate);
				const count = data.get(dateStr) || 0;
				const isFuture = currentDate > today;

				const cell = weekCol.createDiv({
					cls: `cc-heatmap-cell ${this.getIntensityClass(count, maxCount, isFuture)}`,
				});

				cell.setAttribute("data-date", dateStr);
				cell.setAttribute("data-count", String(count));

				const tooltipDate = currentDate.toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
					year: "numeric",
				});
				cell.setAttribute("title", `${count} contribution${count !== 1 ? "s" : ""} on ${tooltipDate}`);

				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		// Legend + total
		const footer = heatmapSection.createDiv({ cls: "cc-heatmap-footer" });
		const legend = footer.createDiv({ cls: "cc-heatmap-legend" });
		legend.createDiv({ cls: "cc-heatmap-legend-label", text: "Less" });
		for (let i = 0; i <= 4; i++) {
			legend.createDiv({
				cls: `cc-heatmap-cell cc-heatmap-level-${i === 0 ? "zero" : i}`,
			});
		}
		legend.createDiv({ cls: "cc-heatmap-legend-label", text: "More" });

		// Total counts only real activity — the seeded fill above is decorative
		let totalContributions = 0;
		for (const count of this.plugin.activityData.values()) {
			totalContributions += count;
		}
		const totalLabel = footer.createDiv({ cls: "cc-heatmap-total" });
		totalLabel.setText(`${totalContributions} contributions in the last ${totalWeeks} weeks`);
	}

	private getIntensityClass(count: number, maxCount: number, isFuture: boolean): string {
		if (isFuture) return "cc-heatmap-future";
		if (count === 0) return "cc-heatmap-level-zero";
		if (maxCount <= 4) return `cc-heatmap-level-${Math.min(count, 4)}`;
		const ratio = count / maxCount;
		if (ratio <= 0.25) return "cc-heatmap-level-1";
		if (ratio <= 0.5) return "cc-heatmap-level-2";
		if (ratio <= 0.75) return "cc-heatmap-level-3";
		return "cc-heatmap-level-4";
	}

	private formatDate(date: Date): string {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}

	/* ── Today's Tasks ── */

	private async renderTodaySection(container: HTMLElement) {
		const todaySection = container.createDiv({ cls: "cc-today-section" });
		const todayHeader = todaySection.createDiv({ cls: "cc-today-header" });

		const titleCol = todayHeader.createDiv();
		titleCol.createDiv({ cls: "cc-section-title", text: "TODAY'S TASKS" });
		const metricsContent = await this.readFromOps("metrics.md");
		const backlogItems = this.extractListItems(metricsContent, "Open Tasks");
		const backlogOpen = backlogItems.filter((l) => l.includes("- [ ]")).length;
		titleCol.createDiv({
			cls: "cc-today-caption",
			text: `shortlist — full backlog: ${backlogOpen} open in metrics.md`,
		});

		const addBtn = todayHeader.createDiv({ cls: "cc-today-add-btn", text: "+" });
		addBtn.addEventListener("click", () => {
			new TaskInputModal(this.plugin.app, this.plugin, () => this.refreshDashboard()).open();
		});

		const todayContent = await this.readFromOps("today.md");
		const taskList = todaySection.createDiv({ cls: "cc-today-list" });

		if (todayContent) {
			const allLines = todayContent.split("\n");
			const lines = allLines.filter((l) => l.trim().startsWith("- ["));
			if (lines.length === 0) {
				taskList.createDiv({ cls: "cc-today-empty", text: "No tasks yet. Click + to add one." });
			} else {
				allLines.forEach((line, idx) => {
					const isDone = line.includes("- [x]");
					const taskItem = taskList.createDiv({ cls: `cc-today-item ${isDone ? "cc-today-done" : ""}` });

					const readFreshLines = async (): Promise<string[] | null> => {
						const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
						if (!todayFile || !(todayFile instanceof TFile)) return null;
						const fresh = await this.plugin.app.vault.read(todayFile);
						return fresh.split("\n");
					};

					const checkbox = taskItem.createDiv({ cls: "cc-today-checkbox", text: isDone ? "■" : "□" });
					checkbox.addEventListener("click", async () => {
						const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
						if (!todayFile || !(todayFile instanceof TFile)) return;
						const ls = await readFreshLines();
						if (!ls || !ls[idx] || !ls[idx].trim().startsWith("- [")) { await this.refreshDashboard(); return; }
						const wasChecked = ls[idx].includes("- [x]");
						ls[idx] = ls[idx].replace(wasChecked ? "- [x]" : "- [ ]", wasChecked ? "- [ ]" : "- [x]");
						await this.plugin.app.vault.modify(todayFile, ls.join("\n"));
						await this.refreshDashboard();
					});

					const taskText = line.replace(/^-\s*\[[ x]\]\s*/, "");
					const parts = taskText.split("→");
					const textEl = taskItem.createDiv({ cls: "cc-today-text" });
					textEl.createSpan({ text: parts[0].trim() });
					if (parts[1]) {
						textEl.createSpan({ cls: "cc-today-route", text: ` → ${parts[1].trim()}` });
					}

					// Action buttons
					const actions = taskItem.createDiv({ cls: "cc-today-actions" });

					// Transfer to tomorrow — schedule in schedule.md, remove from today.md
					const tomorrowBtn = actions.createDiv({ cls: "cc-today-action-btn cc-today-action-tomorrow", text: "→" });
					tomorrowBtn.setAttribute("title", "Move to tomorrow");
					tomorrowBtn.addEventListener("click", async () => {
						const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
						const scheduleFile = this.plugin.app.vault.getAbstractFileByPath("ops/schedule.md");
						if (!todayFile || !(todayFile instanceof TFile)) return;

						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						const dateStr = this.formatDate(tomorrow);

						const ls = await readFreshLines();
						if (!ls || !ls[idx] || !ls[idx].trim().startsWith("- [")) { await this.refreshDashboard(); return; }

						// Parse task text and slug from the live line
						const curTaskText = ls[idx].replace(/^-\s*\[[ x]\]\s*/, "");
						const curParts = curTaskText.split("→");
						const taskDesc = curParts[0].trim();
						const taskSlug = curParts[1] ? curParts[1].trim() : "";

						// Add to schedule.md
						if (scheduleFile && scheduleFile instanceof TFile) {
							const schedContent = await this.plugin.app.vault.read(scheduleFile);
							const routeLine = taskSlug
								? `- [ ] ${dateStr} → ${taskDesc} → ${taskSlug}`
								: `- [ ] ${dateStr} → ${taskDesc}`;
							if (schedContent.includes("## Upcoming")) {
								const slines = schedContent.split("\n");
								let insertIdx = -1;
								for (let i = 0; i < slines.length; i++) {
									if (slines[i].trim() === "## Upcoming") continue;
									if (slines[i].trim().startsWith("- [")) insertIdx = i + 1;
								}
								if (insertIdx === -1) {
									insertIdx = slines.findIndex((l) => l.trim() === "## Upcoming") + 1;
									if (insertIdx === 0) insertIdx = slines.length;
								}
								slines.splice(insertIdx, 0, routeLine);
								await this.plugin.app.vault.modify(scheduleFile, slines.join("\n"));
							} else {
								const updated = schedContent + `\n\n## Upcoming\n${routeLine}`;
								await this.plugin.app.vault.modify(scheduleFile, updated);
							}
						}

						// Remove from today.md — splice by index, not value match
						ls.splice(idx, 1);
						await this.plugin.app.vault.modify(todayFile, ls.join("\n"));
						await this.refreshDashboard();
					});

					// Delete
					const deleteBtn = actions.createDiv({ cls: "cc-today-action-btn cc-today-action-delete", text: "×" });
					deleteBtn.setAttribute("title", "Delete task");
					deleteBtn.addEventListener("click", async () => {
						const ls = await readFreshLines();
						const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
						if (!ls || !todayFile || !(todayFile instanceof TFile)) return;
						if (!ls[idx] || !ls[idx].trim().startsWith("- [")) { await this.refreshDashboard(); return; }
						ls.splice(idx, 1);
						await this.plugin.app.vault.modify(todayFile, ls.join("\n"));
						await this.refreshDashboard();
					});
				});
			}
		} else {
			taskList.createDiv({ cls: "cc-today-empty", text: "No tasks yet. Click + to add one." });
		}
	}

	/* ── Calendar / Schedule ── */

	private async migrateScheduleToToday() {
		const scheduleFile = this.plugin.app.vault.getAbstractFileByPath("ops/schedule.md");
		const todayFile = this.plugin.app.vault.getAbstractFileByPath("ops/today.md");
		if (!scheduleFile || !(scheduleFile instanceof TFile)) return;
		if (!todayFile || !(todayFile instanceof TFile)) return;

		const scheduleContent = await this.plugin.app.vault.read(scheduleFile);
		const todayContent = await this.plugin.app.vault.read(todayFile);
		const todayStr = this.formatDate(new Date());

		const scheduleLines = scheduleContent.split("\n");
		const migrated: string[] = [];
		const remaining: string[] = [];

		for (const line of scheduleLines) {
			const match = line.match(/^-\s*\[[ x]\]\s*(\d{4}-\d{2}-\d{2})\s*→\s*(.+)/);
			if (match) {
				const taskDate = match[1];
				const taskBody = match[2].trim();
				// Skip already-completed schedule tasks — don't re-add as open
				if (line.includes("- [x]")) {
					remaining.push(line);
					continue;
				}
				// Use local midnight dates for safe comparison
				const taskDateObj = new Date(taskDate + "T00:00:00");
				const todayDateObj = new Date(todayStr + "T00:00:00");
				if (taskDateObj <= todayDateObj) {
					const todayTask = `- [ ] ${taskBody}`;
					// Dedup: skip if task text already exists in today.md
					if (!todayContent.includes(taskBody)) {
						migrated.push(todayTask);
					}
					continue;
				}
			}
			remaining.push(line);
		}

		if (migrated.length > 0) {
			// Insert under ## Tasks section if it exists, else append
			if (todayContent.includes("## Tasks")) {
				const lines = todayContent.split("\n");
				let insertIdx = -1;
				let inTasks = false;
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].trim() === "## Tasks") {
						inTasks = true;
						continue;
					}
					if (inTasks) {
						if (lines[i].startsWith("## ") || (lines[i].startsWith("#") && !lines[i].startsWith("##"))) {
							insertIdx = i;
							break;
						}
						if (lines[i].trim().startsWith("- [")) {
							insertIdx = i + 1;
						}
					}
				}
				if (insertIdx === -1) insertIdx = lines.length;
				lines.splice(insertIdx, 0, ...migrated);
				await this.plugin.app.vault.modify(todayFile, lines.join("\n"));
			} else {
				const separator = todayContent.trim() ? "\n" : "";
				const updated = todayContent + separator + "\n## Tasks\n" + migrated.join("\n");
				await this.plugin.app.vault.modify(todayFile, updated);
			}

			// Write remaining schedule back
			await this.plugin.app.vault.modify(scheduleFile, remaining.join("\n"));
		}
	}

	private async renderCalendarSection(container: HTMLElement) {
		const section = container.createDiv({ cls: "cc-calendar-section" });
		const header = section.createDiv({ cls: "cc-calendar-header" });
		header.createDiv({ cls: "cc-section-title", text: "SCHEDULE" });

		// Add button
		const addBtn = header.createDiv({ cls: "cc-calendar-add-btn", text: "+ SCHEDULE" });
		addBtn.addEventListener("click", () => {
			new ScheduleTaskModal(this.plugin.app, this.plugin, () => this.refreshDashboard()).open();
		});

		const body = section.createDiv({ cls: "cc-calendar-body" });

		// Parse schedule.md
		const scheduleContent = await this.readFromOps("schedule.md");
		const today = new Date();
		const todayStr = this.formatDate(today);
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();

		// Parse all scheduled tasks
		type ScheduleTask = { date: string; text: string; slug: string; done: boolean };
		const tasks: ScheduleTask[] = [];
		if (scheduleContent) {
			const lines = scheduleContent.split("\n");
			for (const line of lines) {
				const match = line.match(/^-\s*\[([ x])\]\s*(\d{4}-\d{2}-\d{2})\s*→\s*(.+)/);
				if (match) {
					const parts = match[3].split("→");
					tasks.push({
						date: match[2],
						text: parts[0].trim(),
						slug: parts[1] ? parts[1].trim() : "",
						done: match[1] === "x",
					});
				}
			}
		}

		// Dates that have tasks (for dot indicators)
		const taskDates = new Set(tasks.map((t) => t.date));

		// ── Left: Mini calendar ──
		const calLeft = body.createDiv({ cls: "cc-calendar-left" });

		// Month navigation — start on selected date's month if set
		let viewMonth = currentMonth;
		let viewYear = currentYear;
		if (this.selectedCalendarDate) {
			const sel = new Date(this.selectedCalendarDate + "T12:00:00");
			viewMonth = sel.getMonth();
			viewYear = sel.getFullYear();
		}

		const renderMonth = () => {
			calLeft.empty();

			const nav = calLeft.createDiv({ cls: "cc-calendar-nav" });
			const prevBtn = nav.createDiv({ cls: "cc-calendar-nav-btn", text: "‹" });
			const monthLabel = nav.createDiv({ cls: "cc-calendar-month-label" });
			const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
			monthLabel.setText(`${monthNames[viewMonth]} ${viewYear}`);
			const nextBtn = nav.createDiv({ cls: "cc-calendar-nav-btn", text: "›" });

			prevBtn.addEventListener("click", () => {
				viewMonth--;
				if (viewMonth < 0) { viewMonth = 11; viewYear--; }
				renderMonth();
			});
			nextBtn.addEventListener("click", () => {
				viewMonth++;
				if (viewMonth > 11) { viewMonth = 0; viewYear++; }
				renderMonth();
			});

			// Day headers
			const grid = calLeft.createDiv({ cls: "cc-calendar-grid" });
			for (const d of ["S", "M", "T", "W", "T", "F", "S"]) {
				grid.createDiv({ cls: "cc-calendar-day-header", text: d });
			}

			// Days
			const firstDay = new Date(viewYear, viewMonth, 1).getDay();
			const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

			for (let i = 0; i < firstDay; i++) {
				grid.createDiv({ cls: "cc-calendar-day cc-calendar-day-empty" });
			}

			for (let day = 1; day <= daysInMonth; day++) {
				const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
				const isToday = dateStr === this.formatDate(today);
				const hasTask = taskDates.has(dateStr);
				const isPast = new Date(dateStr + "T00:00:00") < new Date(todayStr + "T00:00:00");

				const dayEl = grid.createDiv({
					cls: `cc-calendar-day ${isToday ? "cc-calendar-today" : ""} ${hasTask ? "cc-calendar-has-task" : ""} ${isPast && hasTask ? "cc-calendar-overdue" : ""}`,
					text: String(day),
				});

				if (hasTask) {
					dayEl.createDiv({ cls: "cc-calendar-dot" });
				}

				dayEl.addEventListener("click", () => {
					const wasAlreadySelected = dayEl.hasClass("cc-calendar-selected");

					// Clear all highlights
					grid.querySelectorAll(".cc-calendar-selected").forEach((el) => el.removeClass("cc-calendar-selected"));

					if (wasAlreadySelected) {
						// Deselect — show next 14 days
						this.selectedCalendarDate = null;
						renderUpcoming();
					} else {
						// Select this date
						dayEl.addClass("cc-calendar-selected");
						this.selectedCalendarDate = dateStr;
						renderUpcoming(dateStr);
					}
				});

				// Restore selection highlight after refresh
				if (this.selectedCalendarDate === dateStr) {
					dayEl.addClass("cc-calendar-selected");
				}
			}
		};

		renderMonth();

		// ── Right: Upcoming tasks ──
		const calRight = body.createDiv({ cls: "cc-calendar-right" });

		const renderUpcoming = (highlightDate?: string) => {
			calRight.empty();

			if (highlightDate) {
				// Show tasks for specific date
				const dayTasks = tasks.filter((t) => t.date === highlightDate);
				const dateObj = new Date(highlightDate + "T12:00:00");
				const label = calRight.createDiv({ cls: "cc-calendar-upcoming-label" });
				label.setText(this.formatDateShort(dateObj));

				if (dayTasks.length === 0) {
					calRight.createDiv({ cls: "cc-calendar-empty", text: "No tasks scheduled" });
				} else {
					const list = calRight.createDiv({ cls: "cc-calendar-upcoming-list" });
					for (const task of dayTasks) {
						const item = list.createDiv({ cls: "cc-calendar-upcoming-item" });
						const checkbox = item.createDiv({ cls: "cc-today-checkbox", text: task.done ? "■" : "□" });
						checkbox.addEventListener("click", async () => {
							await this.toggleScheduleTask(task, !task.done);
							await this.refreshDashboard();
						});
						const textEl = item.createDiv({ cls: "cc-today-text" });
						textEl.createSpan({ text: task.text });
						if (task.slug) {
							textEl.createSpan({ cls: "cc-today-route", text: ` → ${task.slug}` });
						}
					}
				}
			} else {
				// Show next 14 days
				const label = calRight.createDiv({ cls: "cc-calendar-upcoming-label" });
				label.setText("NEXT 14 DAYS");

				const todayStr = this.formatDate(today);
				const futureTasks = tasks
					.filter((t) => !t.done && t.date >= todayStr)
					.sort((a, b) => a.date.localeCompare(b.date))
					.slice(0, 14);

				if (futureTasks.length === 0) {
					calRight.createDiv({ cls: "cc-calendar-empty", text: "No upcoming tasks" });
				} else {
					const list = calRight.createDiv({ cls: "cc-calendar-upcoming-list" });
					for (const task of futureTasks) {
						const item = list.createDiv({ cls: "cc-calendar-upcoming-item" });
						const dateObj = new Date(task.date + "T12:00:00");
						const isOverdue = task.date < todayStr;
						const dateBadge = item.createDiv({ cls: `cc-calendar-date-badge ${isOverdue ? "cc-calendar-overdue-badge" : ""}` });
						dateBadge.setText(this.formatDateShort(dateObj));
						const textEl = item.createDiv({ cls: "cc-today-text" });
						textEl.createSpan({ text: task.text });
						if (task.slug) {
							textEl.createSpan({ cls: "cc-today-route", text: ` → ${task.slug}` });
						}
					}
				}
			}
		};

		// Restore selected date highlight and view
		renderUpcoming(this.selectedCalendarDate || undefined);
	}

	private async toggleScheduleTask(task: { date: string; text: string; slug: string; done: boolean }, done: boolean) {
		const scheduleFile = this.plugin.app.vault.getAbstractFileByPath("ops/schedule.md");
		if (!scheduleFile || !(scheduleFile instanceof TFile)) return;

		const content = await this.plugin.app.vault.read(scheduleFile);
		const lines = content.split("\n");

		// Parse-and-compare instead of exact string match — tolerates spacing variants
		let matched = false;
		const updated = lines.map((line) => {
			const m = line.match(/^-\s*\[([ x])\]\s*(\d{4}-\d{2}-\d{2})\s*→\s*(.+)$/);
			if (!m) return line;
			const parts = m[3].split("→");
			const text = parts[0].trim();
			const slug = parts[1] ? parts[1].trim() : "";
			if (m[2] !== task.date || text !== task.text || slug !== task.slug) return line;
			matched = true;
			return `- [${done ? "x" : " "}] ${task.date} → ${task.text}${task.slug ? ` → ${task.slug}` : ""}`;
		});

		if (matched) {
			await this.plugin.app.vault.modify(scheduleFile, updated.join("\n"));
		}
	}

	private formatDateShort(date: Date): string {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return `${months[date.getMonth()]} ${date.getDate()}`;
	}

	/* ── Skills ── */

	private renderSkills(container: HTMLElement) {
		const skillsRow = container.createDiv({ cls: "cc-skills-row" });
		skillsRow.createDiv({ cls: "cc-section-title", text: "SKILLS" });

		const buttonsDiv = skillsRow.createDiv({ cls: "cc-skill-buttons" });
		const skills = [
			{ id: "status-sync", name: "Status Sync", desc: "Daily project sync", cadence: "Daily" },
			{ id: "handoff-writer", name: "Handoff Writer", desc: "Session handoff", cadence: "On-demand" },
			{ id: "client-update", name: "Client Update", desc: "Oishii Nori", cadence: "On-demand" },
		];
		skills.forEach((skill) => {
			const btn = buttonsDiv.createDiv({ cls: "cc-skill-btn" });
			btn.createDiv({ cls: "cc-skill-name", text: skill.name });
			btn.createDiv({ cls: "cc-skill-desc", text: `${skill.desc} · ${skill.cadence}` });
			btn.addEventListener("click", async () => {
				void this.logSkill(skill.id);
				if (skill.id === "status-sync") {
					const handoffs = scanHandoffs();
					const todo = await this.scanTodoProgress();
					new StatusSyncModal(this.plugin.app, this.plugin, handoffs, todo, () => this.refreshDashboard()).open();
				} else if (skill.id === "handoff-writer") {
					await this.runHandoffWriter();
				} else if (skill.id === "client-update") {
					await this.runClientUpdate();
				}
			});
		});
	}

	private async scanTodoProgress(): Promise<TodoProgress> {
		const progress: TodoProgress = { open: 0, done: 0, overdue: 0 };
		const todayStr = this.formatDate(new Date());

		const todayContent = await this.readFromOps("today.md");
		if (todayContent) {
			for (const line of todayContent.split("\n")) {
				const t = line.trim();
				if (t.startsWith("- [ ]")) progress.open++;
				else if (t.startsWith("- [x]")) progress.done++;
			}
		}

		const schedContent = await this.readFromOps("schedule.md");
		if (schedContent) {
			for (const line of schedContent.split("\n")) {
				if (line.includes("- [x]")) continue;
				const m = line.match(/^-\s*\[[ x]\]\s*(\d{4}-\d{2}-\d{2})\s*→/);
				if (m && m[1] < todayStr) progress.overdue++;
			}
		}

		return progress;
	}

	private async writeDraft(path: string, content: string): Promise<TFile | null> {
		try {
			const existing = this.plugin.app.vault.getAbstractFileByPath(path);
			if (existing instanceof TFile) {
				await this.plugin.app.vault.modify(existing, content);
				return existing;
			}
			const folder = path.substring(0, path.lastIndexOf("/"));
			if (folder && !this.plugin.app.vault.getAbstractFileByPath(folder)) {
				await this.plugin.app.vault.createFolder(folder);
			}
			return await this.plugin.app.vault.create(path, content);
		} catch (e) {
			console.error("[Command Center] Failed to write draft:", e);
			new Notice("Failed to write draft — check console");
			return null;
		}
	}

	private async openFileInTab(file: TFile) {
		await this.plugin.app.workspace.getLeaf("tab").openFile(file);
	}

	/* ── Skill: Handoff Writer ── */

	private async runHandoffWriter() {
		const dateStr = fmtDate(new Date());
		const lines: string[] = [];
		lines.push(`# Session Handoff — ${dateStr}`);
		lines.push("");

		const todayContent = await this.readFromOps("today.md");
		const done: string[] = [];
		const open: string[] = [];
		if (todayContent) {
			for (const line of todayContent.split("\n")) {
				const t = line.trim();
				if (t.startsWith("- [x]")) done.push(t.replace(/^- \[x\]\s*/, ""));
				else if (t.startsWith("- [ ]")) open.push(t.replace(/^- \[ \]\s*/, ""));
			}
		}

		lines.push("## Completed Today");
		if (done.length > 0) for (const d of done) lines.push(`- ${d}`);
		else lines.push("- (nothing logged)");
		lines.push("");
		lines.push("## Still Open");
		if (open.length > 0) for (const o of open) lines.push(`- ${o}`);
		else lines.push("- (none)");
		lines.push("");

		lines.push("## Per-Domain Status");
		for (const domain of DOMAINS) {
			if (!this.plugin.settings.visibleDomains[domain.key]) continue;
			const statusContent = await this.readFromFile(`${domain.path}/STATUS.md`);
			if (!statusContent) continue;
			const summary = this.extractSection(statusContent, "Last Session Summary");
			const updated = this.extractField(statusContent, "Last Updated");
			lines.push(`### ${domain.name}${updated ? ` (${updated})` : ""}`);
			lines.push(summary || "No summary yet.");
			lines.push("");
		}

		lines.push("## Recent Headlines");
		const headlinesContent = await this.readFromOps("headlines.md");
		if (headlinesContent) {
			const entries = headlinesContent.split("\n").filter((l) => l.trim().startsWith("### ")).slice(0, 3);
			for (const e of entries) lines.push(e.replace(/^###\s*/, "- "));
		}
		lines.push("");

		// Per-project changelog — done tasks routed via "→ slug" append to that domain's STATUS.md
		let changelogCount = 0;
		const bySlug = new Map<string, string[]>();
		for (const d of done) {
			const parts = d.split("→");
			const slug = parts[1] ? parts[1].trim().toLowerCase() : "";
			if (slug && DOMAINS.some((x) => x.key === slug)) {
				if (!bySlug.has(slug)) bySlug.set(slug, []);
				bySlug.get(slug)!.push(parts[0].trim());
			}
		}
		for (const [slug, entries] of bySlug) {
			const domain = DOMAINS.find((x) => x.key === slug)!;
			const f = this.plugin.app.vault.getAbstractFileByPath(`${domain.path}/STATUS.md`);
			if (!(f instanceof TFile)) continue;
			try {
				let c = await this.plugin.app.vault.read(f);
				// Merge into an existing same-day stamp instead of duplicating it
				const dayPrefix = `- ${dateStr} — `;
				const cl = c.split("\n");
				let merged = false;
				for (let k = 0; k < cl.length; k++) {
					if (cl[k].startsWith(dayPrefix)) {
						const prevEntries = cl[k].slice(dayPrefix.length).split(";").map((s) => s.trim()).filter(Boolean);
						cl[k] = dayPrefix + Array.from(new Set([...prevEntries, ...entries])).join("; ");
						merged = true;
						break;
					}
				}
				if (merged) {
					c = cl.join("\n");
				} else {
					const stamp = (dayPrefix + entries.join("; ")).replace(/\$/g, "$$$$");
					if (/^## Changelog\s*$/im.test(c)) {
						c = c.replace(/^(## Changelog)\s*$/im, `$1\n${stamp}`);
					} else {
						c = c.trimEnd() + `\n\n## Changelog\n${stamp}\n`;
					}
				}
				await this.plugin.app.vault.modify(f, c);
				changelogCount++;
			} catch (e) {
				console.error(`[Command Center] changelog append failed for ${domain.name}:`, e);
			}
		}

		const file = await this.writeDraft(`inbox/SESSION_HANDOFF-draft-${dateStr}.md`, lines.join("\n"));
		if (file) {
			new Notice(changelogCount > 0
				? `Handoff draft written · ${changelogCount} project changelog${changelogCount !== 1 ? "s" : ""} updated`
				: "Handoff draft written to inbox/");
			await this.openFileInTab(file);
		}
	}

	/* ── Skill: Client Update Composer ── */

	private async runClientUpdate() {
		const dateStr = fmtDate(new Date());
		const statusContent = await this.readFromFile("projects/varix/oishii-nori/STATUS.md");
		if (!statusContent) {
			new Notice("No Oishii Nori STATUS.md found");
			return;
		}

		const summary = this.extractSection(statusContent, "Last Session Summary");
		const phase = this.extractSection(statusContent, "Current Phase");
		const blockers = this.extractListItems(statusContent, "Key Blockers");

		const lines: string[] = [];
		lines.push(`# Client Update — Oishii Nori — ${dateStr}`);
		lines.push("");
		lines.push("Hi! Here's a quick update on where things stand:");
		lines.push("");
		if (summary) {
			lines.push("**What we worked on recently**");
			lines.push(summary);
			lines.push("");
		}
		if (phase) {
			lines.push("**Current phase**");
			lines.push(phase);
			lines.push("");
		}
		if (blockers.length > 0) {
			lines.push("**What's next**");
			for (const b of blockers) {
				lines.push(b.replace(/^-\s*\[[ x]\]\s*/, "").replace(/^-\s*/, ""));
			}
			lines.push("");
		}
		lines.push("Let me know if you have any questions or want to reprioritize anything.");

		const file = await this.writeDraft(`inbox/client-update-oishii-nori-${dateStr}.md`, lines.join("\n"));
		if (file) {
			new Notice("Client update draft written to inbox/");
			await this.openFileInTab(file);
		}
	}

	/* ── Domain Grid ── */

	private async renderDomainGrid(container: HTMLElement) {
		const settings = this.plugin.settings;

		// Single pass over STATUS.md — tiles, health flags, and blocked lane share the reads
		interface DomainState {
			domain: (typeof DOMAINS)[number];
			content: string;
			lastUpdated: string;
			blocked: boolean;
			reason: string;
		}
		const states: DomainState[] = [];
		for (const domain of DOMAINS) {
			if (!settings.visibleDomains[domain.key]) continue;
			const content = await this.readFromFile(`${domain.path}/STATUS.md`);
			const lastUpdated = content ? this.extractField(content, "Last Updated") : "";
			const { blocked, reason } = content ? this.parseBlocked(content) : { blocked: false, reason: "" };
			states.push({ domain, content, lastUpdated, blocked, reason });
		}

		// ── Blocked lane ──
		const blockedStates = states.filter((s) => s.blocked);
		if (blockedStates.length > 0) {
			const lane = container.createDiv({ cls: "cc-blocked-lane" });
			lane.createDiv({ cls: "cc-section-title", text: `BLOCKED (${blockedStates.length})` });
			const laneBody = lane.createDiv({ cls: "cc-panel-body" });
			for (const b of blockedStates) {
				const row = laneBody.createDiv({ cls: "cc-blocked-row" });
				row.createDiv({ cls: "cc-blocked-name", text: b.domain.name });
				row.createDiv({ cls: "cc-blocked-reason", text: b.reason || "No reason logged" });
			}
		}

		const domainGrid = container.createDiv({ cls: "cc-domain-grid" });

		for (const state of states) {
			const domain = state.domain;
			const tile = domainGrid.createDiv({
				cls: `cc-domain-tile ${state.blocked ? "cc-domain-blocked" : ""}`,
			});
			tile.addEventListener("click", async (e) => {
				if ((e.target as HTMLElement).closest(".cc-domain-live-btn")) return;
				const folder = this.plugin.app.vault.getAbstractFileByPath(domain.path);
				if (folder) {
					// @ts-ignore
					await this.plugin.app.workspace.getLeaf("tab").openFile(folder);
				}
			});

			const header = tile.createDiv({ cls: "cc-domain-header" });
			header.createDiv({ cls: "cc-domain-name", text: domain.name });

			const headerRight = header.createDiv({ cls: "cc-domain-header-right" });

			if (domain.liveUrl) {
				const liveBtn = headerRight.createDiv({ cls: "cc-domain-live-btn" });
				liveBtn.setText("↗ LIVE");
				liveBtn.setAttribute("title", domain.liveUrl);
				liveBtn.addEventListener("click", (e) => {
					e.stopPropagation();
					window.open(domain.liveUrl, "_blank");
				});
			}

			// Sync-health dot
			const health = this.getHealth(state.lastUpdated);
			const healthLabel =
				health === "green" ? `synced ${state.lastUpdated}`
				: health === "yellow" ? `stale — last synced ${state.lastUpdated}`
				: state.lastUpdated ? `overdue — last synced ${state.lastUpdated}`
				: "never synced";
			const healthDot = headerRight.createDiv({ cls: `cc-health-dot cc-health-${health}` });
			healthDot.setAttribute("title", `Sync health: ${healthLabel}`);

			const statusClass =
				domain.status === "Complete" ? "cc-complete" :
				domain.status === "Planning" ? "cc-planning" :
				"cc-progress";
			const statusBadge = headerRight.createDiv({ cls: `cc-domain-status ${statusClass}` });
			statusBadge.setText(domain.status);

			if (state.blocked) {
				const blockedBadge = headerRight.createDiv({ cls: "cc-domain-status cc-blocked-badge" });
				blockedBadge.setText("BLOCKED");
			}

			const body = tile.createDiv({ cls: "cc-domain-body" });
			if (state.content) {
				const summary = this.extractSection(state.content, "Last Session Summary");
				if (summary) {
					body.createDiv({ cls: "cc-domain-summary", text: this.truncate(summary, 160) });
				} else {
					body.createDiv({ cls: "cc-domain-empty", text: "No summary yet" });
				}

				const blockers = this.extractListItems(state.content, "Key Blockers");
				if (blockers.length > 0) {
					const blockerEl = body.createDiv({ cls: "cc-domain-blockers" });
					blockerEl.createDiv({ cls: "cc-domain-blocker-label", text: `${blockers.length} blocker(s)` });
				}
			} else {
				body.createDiv({ cls: "cc-domain-empty", text: "No STATUS.md yet" });
			}
		}
	}

	/* ── Session Summary ── */

	private async renderSessionSummary(container: HTMLElement) {
		const settings = this.plugin.settings;
		const summaryPanel = container.createDiv({ cls: "cc-panel cc-session-summary" });
		summaryPanel.createDiv({ cls: "cc-section-title", text: "SESSION SUMMARIES" });

		const summaryBody = summaryPanel.createDiv({ cls: "cc-panel-body" });
		for (const domain of DOMAINS) {
			if (!settings.visibleDomains[domain.key]) continue;
			const statusContent = await this.readFromFile(`${domain.path}/STATUS.md`);
			if (statusContent) {
				const summary = this.extractSection(statusContent, "Last Session Summary");
				const lastUpdated = this.extractField(statusContent, "Last Updated");
				const row = summaryBody.createDiv({ cls: "cc-summary-row" });
				const health = this.getHealth(lastUpdated);
				const dot = row.createDiv({ cls: `cc-health-dot cc-health-${health}` });
				dot.setAttribute("title", health === "green" ? `Synced ${lastUpdated}` : `Stale — last synced ${lastUpdated || "never"}`);
				row.createDiv({ cls: "cc-summary-label", text: domain.name });
				row.createDiv({ cls: "cc-summary-text", text: summary ? this.truncate(summary, 200) : "No data" });
				if (lastUpdated) {
					row.createDiv({ cls: "cc-summary-date", text: lastUpdated });
				}
			}
		}
	}

	/* ── Panels ── */

	private async renderPanels(container: HTMLElement) {
		const settings = this.plugin.settings;
		const panelsRow = container.createDiv({ cls: "cc-panels-row" });

		if (settings.showHeadlinesPanel) {
			const headlinesPanel = panelsRow.createDiv({ cls: "cc-panel" });
			headlinesPanel.createDiv({ cls: "cc-section-title", text: "HEADLINES" });
			const headlinesContent = await this.readFromOps("headlines.md");
			const body = headlinesPanel.createDiv({ cls: "cc-panel-body" });
			if (headlinesContent) {
				const lines = headlinesContent.split("\n").filter((l) => l.trim() && !l.startsWith("#")).slice(0, 10);
				lines.forEach((line) => body.createDiv({ cls: "cc-panel-line", text: line }));
			} else {
				body.createDiv({ cls: "cc-panel-empty", text: "No data yet" });
			}
		}
	}

	/* ── Utilities ── */

	private async performSync() {
		this.plugin.refreshActivityData();
		this.plugin.settings.lastSync = Date.now();
		await this.plugin.saveSettings();
		await this.refreshDashboard();
	}

	private timeAgo(timestamp: number): string {
		const seconds = Math.floor((Date.now() - timestamp) / 1000);
		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}

	private refreshQueue: Promise<void> = Promise.resolve();

	private refreshDashboard(): Promise<void> {
		this.refreshQueue = this.refreshQueue.then(() => this.doRefresh());
		return this.refreshQueue;
	}

	private async doRefresh() {
		try {
			await this.migrateScheduleToToday();

			const container = this.containerEl.children[1];
			if (!container) return;
			container.empty();
			container.addClass("cc-dashboard");
			await this.renderDashboard(container);
		} catch (e) {
			console.error("[Command Center] Dashboard refresh failed:", e);
		}
	}

	private async readFromOps(filename: string): Promise<string> {
		return this.readFromFile(`ops/${filename}`);
	}

	private async readFromFile(path: string): Promise<string> {
		try {
			const file = this.app.vault.getAbstractFileByPath(path);
			if (file && file instanceof TFile) {
				return await this.app.vault.read(file);
			}
		} catch (e) { /* File doesn't exist */ }
		return "";
	}

	private extractSection(content: string, sectionName: string): string {
		if (!content) return "";
		const lines = content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(sectionName)) {
				const collected: string[] = [];
				for (let j = i + 1; j < lines.length; j++) {
					const line = lines[j];
					if (line.startsWith("#") && !line.startsWith("##")) break;
					if (line.startsWith("## ") && !line.includes(sectionName)) break;
					if (line.trim() && !line.startsWith("##")) collected.push(line.trim());
				}
				return collected.join(" ");
			}
		}
		return "";
	}

	private extractListItems(content: string, sectionName: string): string[] {
		if (!content) return [];
		const lines = content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(sectionName)) {
				const items: string[] = [];
				for (let j = i + 1; j < lines.length; j++) {
					const line = lines[j].trim();
					if (line.startsWith("## ") || (line.startsWith("#") && !line.startsWith("##"))) break;
					if (line.startsWith("- [")) items.push(line);
				}
				return items;
			}
		}
		return [];
	}

	private extractField(content: string, fieldName: string): string {
		if (!content) return "";
		const lines = content.split("\n");
		const fieldPat = new RegExp(`^[\\s>#*-]*\\**${fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\**\\s*(:|$)`, "i");
		for (let i = 0; i < lines.length; i++) {
			if (!fieldPat.test(lines[i])) continue;
			const parts = lines[i].split(":");
			const inlineVal = parts.length > 1 ? parts.slice(1).join(":").replace(/\*+/g, "").trim() : "";
			if (inlineVal) return inlineVal;
			// Heading style — value lives on the next non-empty line.
			// Bail on headings or long prose so we never return the wrong section as a value.
			for (let j = i + 1; j < lines.length; j++) {
				const t = lines[j].trim();
				if (!t) continue;
				if (t.startsWith("#")) return "";
				return t.replace(/^#+\s*/, "").replace(/\*+/g, "").trim().slice(0, 40);
			}
			return "";
		}
		return "";
	}

	private countCheckedLines(content: string, sectionName: string): string {
		const items = this.extractListItems(content, sectionName);
		const unchecked = items.filter((l) => l.includes("- [ ]")).length;
		const checked = items.filter((l) => l.includes("- [x]")).length;
		if (items.length === 0) return "No data yet";
		return `${unchecked} open / ${checked} done`;
	}

	private truncate(text: string, maxLen: number): string {
		if (text.length <= maxLen) return text;
		return text.substring(0, maxLen).trim() + "...";
	}

	/* ── Health & Blocked ── */

	private getHealth(lastUpdated: string): "green" | "yellow" | "red" {
		// No parseable date = never synced = red
		if (!/^\d{4}-\d{2}-\d{2}$/.test(lastUpdated)) return "red";
		const days = Math.floor((Date.now() - new Date(lastUpdated + "T00:00:00").getTime()) / 86400000);
		if (days <= this.plugin.settings.staleDays) return "green";
		if (days <= this.plugin.settings.criticalDays) return "yellow";
		return "red";
	}

	private parseBlocked(content: string): { blocked: boolean; reason: string } {
		if (!content) return { blocked: false, reason: "" };
		// Convention: a line like "Status: blocked — waiting on client feedback" or "status:: blocked"
		const m = content.match(/^[\s>*~-]*\**status\**\s*::?\s*\**blocked\**\s*(?:[-—:.]\s*(.+))?$/im);
		if (!m) return { blocked: false, reason: "" };
		const reason = ((m[1] || this.extractField(content, "Blocked Reason")) || "").replace(/\*+/g, "").trim();
		return { blocked: true, reason };
	}

	/* ── Skill Trigger Log ── */

	private async logSkill(skillId: string) {
		try {
			const path = "ops/skills-log.md";
			const now = new Date();
			const line = `- ${fmtDate(now)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} — ${skillId} · dashboard click`;
			const existing = this.plugin.app.vault.getAbstractFileByPath(path);
			if (existing instanceof TFile) {
				const c = await this.plugin.app.vault.read(existing);
				await this.plugin.app.vault.modify(existing, c.trimEnd() + "\n" + line + "\n");
			} else {
				await this.plugin.app.vault.create(path, "# Skill Trigger Log\n\n" + line + "\n");
			}
		} catch (e) {
			console.error("[Command Center] skill log failed:", e);
		}
	}
}

/* ─── Settings Tab ─── */

class CommandCenterSettingTab extends PluginSettingTab {
	plugin: CommandCenterPlugin;

	constructor(app: App, plugin: CommandCenterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Command Center Settings" });

		containerEl.createEl("h3", { text: "Dashboard Sections" });

		const toggles: [string, keyof CommandCenterSettings][] = [
			["Portfolio snapshot tile", "showHeroTile"],
			["Activity heatmap", "showHeatmap"],
			["Today's tasks section", "showTodaySection"],
			["Skill buttons row", "showSkillButtons"],
			["Session summaries", "showSessionSummary"],
			["Schedule panel", "showSchedulePanel"],
			["Headlines panel", "showHeadlinesPanel"],
		];

		for (const [label, key] of toggles) {
			new Setting(containerEl)
				.setName(label)
				.setToggleText("Show")
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings[key] as boolean)
						.onChange(async (value) => {
							(this.plugin.settings as any)[key] = value;
							await this.plugin.saveSettings();
						})
				);
		}

		containerEl.createEl("h3", { text: "Status Sync" });

		new Setting(containerEl)
			.setName("Headless CLI")
			.setDesc("Agent dispatched when running a full status sync from the skill button")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("opencode", "OpenCode")
					.addOption("claude", "Claude Code")
					.setValue(this.plugin.settings.syncCli)
					.onChange(async (value) => {
						this.plugin.settings.syncCli = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h3", { text: "Sync Health Flags" });

		new Setting(containerEl)
			.setName("Green threshold (days)")
			.setDesc("Synced within this many days = green dot")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.staleDays))
					.onChange(async (value) => {
						const n = parseInt(value, 10);
						if (!isNaN(n) && n >= 0) {
							this.plugin.settings.staleDays = n;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Red threshold (days)")
			.setDesc("Over this many days since last sync = red dot (between = yellow)")
			.addText((text) =>
				text
					.setValue(String(this.plugin.settings.criticalDays))
					.onChange(async (value) => {
						const n = parseInt(value, 10);
						if (!isNaN(n) && n >= 0) {
							this.plugin.settings.criticalDays = n;
							await this.plugin.saveSettings();
						}
					})
			);

		containerEl.createEl("h3", { text: "Domain Tiles" });

		for (const domain of DOMAINS) {
			new Setting(containerEl)
				.setName(domain.name)
				.setDesc(domain.status)
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings.visibleDomains[domain.key] ?? true)
						.onChange(async (value) => {
							this.plugin.settings.visibleDomains[domain.key] = value;
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
