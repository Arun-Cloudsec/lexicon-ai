/* ─── Agent Sample Data — Lexicon AI ─── */

export const SAMPLE_CONTRACT_REGISTER = `CONTRACT_ID,VENDOR,TYPE,VALUE_USD,START_DATE,END_DATE,AUTO_RENEW,CANCEL_NOTICE_DAYS,STATUS,OWNER
CTR-001,Westlaw,Research Subscription,145000,2023-06-01,2025-07-15,Yes,90,Active,Legal Ops
CTR-002,DocuSign,SaaS Platform,89000,2024-01-15,2025-06-30,Yes,60,Active,IT/Legal
CTR-003,Relativity,eDiscovery Platform,210000,2023-03-01,2025-06-20,No,30,Active,Litigation
CTR-004,Ironclad,CLM Platform,175000,2024-06-01,2026-05-31,Yes,90,Active,Legal Ops
CTR-005,Baker McKenzie,Outside Counsel,500000,2024-01-01,2025-12-31,No,60,Active,GC Office
CTR-006,Dentons,IP Prosecution,320000,2023-09-01,2025-08-31,Yes,90,Active,IP Team
CTR-007,iManage,DMS,95000,2024-03-15,2026-03-14,Yes,60,Active,IT
CTR-008,Axiom,Managed Legal Services,280000,2023-12-01,2025-06-15,No,45,Active,Legal Ops
CTR-009,Kira Systems,AI Review,125000,2024-07-01,2025-06-30,Yes,30,Active,M&A
CTR-010,CourtListener,Court Data,18000,2024-01-01,2025-12-31,Yes,30,Active,Litigation
CTR-011,Everlaw,eDiscovery,165000,2024-04-01,2026-03-31,Yes,60,Active,Litigation
CTR-012,BRYTER,No-Code Legal,55000,2024-08-01,2025-07-31,Yes,30,Active,Innovation
CTR-013,Luminance,AI Diligence,198000,2023-11-01,2025-10-31,Yes,90,Active,Corporate
CTR-014,Definely,Doc Comparison,32000,2024-06-15,2025-06-14,Yes,30,Active,Legal Ops
CTR-015,Thomson Reuters Practical Law,Know-How,78000,2024-01-01,2025-12-31,Yes,60,Active,Knowledge
CTR-016,Compliance.ai,Reg Intelligence,42000,2024-09-01,2025-08-31,Yes,30,Active,Regulatory
CTR-017,AWS (Legal Infra),Cloud Hosting,156000,2024-01-01,2025-12-31,No,90,Active,IT
CTR-018,NetDocuments,Cloud DMS,88000,2023-07-01,2025-06-30,Yes,60,Active,IT
CTR-019,ContractPodAI,CLM,135000,2024-02-01,2026-01-31,Yes,60,Active,Legal Ops
CTR-020,Litera,Drafting Suite,47000,2024-04-15,2025-04-14,Yes,30,Active,Legal Ops`;

export const SAMPLE_REG_UPDATES = `REG_ID,AGENCY,TITLE,EFFECTIVE_DATE,COMMENT_DEADLINE,IMPACT_AREA,SUMMARY
REG-2025-001,SEC,Cybersecurity Incident Disclosure Amendment,2025-09-01,,Securities/Cyber,"Expands Form 8-K cybersecurity incident reporting to include AI system failures that materially impact operations"
REG-2025-002,FTC,AI Transparency in Legal Services,2025-11-15,2025-07-30,Consumer Protection/AI,"Proposed rule requiring disclosure when AI systems are used in legal service delivery affecting consumer rights"
REG-2025-003,DOJ,Corporate Compliance Program AI Guidance,2025-07-01,,Criminal/Compliance,"Updated guidance on evaluating corporate compliance programs that use AI — requires human oversight documentation"
REG-2025-004,EU Commission,AI Act Implementing Regulation — Legal Sector,2025-10-01,,AI/Privacy,"Implementing rules for high-risk AI systems in legal decision-making under EU AI Act Article 6"
REG-2025-005,CA Attorney General,CA AI Accountability Act Regulations,2025-08-15,2025-06-15,State/AI,"Implementing regulations for SB-1047 successor requiring impact assessments for AI in legal practice"
REG-2025-006,NY DFS,Cybersecurity Regulation Amendment (500.1),2025-12-01,,Cyber/Financial,"Extends cybersecurity requirements to legal service providers handling financial institution data"
REG-2025-007,HHS,HIPAA AI Addendum,2025-09-30,2025-08-01,Healthcare/AI,"Proposed rule extending HIPAA requirements to AI systems processing protected health information in legal contexts"`;

export const SAMPLE_LIT_HOLDS = `HOLD_ID,MATTER,ISSUE_DATE,CUSTODIAN_COUNT,ACKNOWLEDGED,DATA_SOURCES,LAST_REMINDER,STATUS
LH-001,Acme v. GlobalTech (Patent),2024-03-15,12,10,"Email;Slack;Drive;Code Repos",2025-04-01,Active
LH-002,DOJ Investigation - Antitrust,2024-06-22,25,25,"Email;Teams;SharePoint;SAP;Salesforce",2025-05-10,Active
LH-003,Employment Class Action - CA,2024-09-01,8,6,"Email;HRIS;Slack;Payroll",2025-03-15,Active
LH-004,SEC Inquiry - Disclosure,2024-11-10,15,12,"Email;Drive;Slack;Finance Systems;Board Portal",2025-05-01,Active
LH-005,Product Liability - Widget X,2025-01-05,6,6,"Email;Jira;Confluence;QA Systems",2025-04-20,Active
LH-006,Trade Secret - Former Employee,2025-02-18,4,2,"Email;Drive;GitHub;Laptop Images",2025-03-01,Active`;

export const SAMPLE_PRIV_LOG = `DOC_ID,DATE,FROM,TO,CC,PRIVILEGE_BASIS,DESCRIPTION,PRODUCED
PRIV-001,2024-06-15,john.doe@company.com,outside.counsel@firm.com,,Attorney-Client,"Communication seeking legal advice regarding patent portfolio strategy",No
PRIV-002,2024-06-18,outside.counsel@firm.com,john.doe@company.com,gc@company.com,Attorney-Client,"Legal advice regarding patent infringement risk assessment",No
PRIV-003,2024-07-01,jane.smith@company.com,john.doe@company.com,,Work Product,"Draft litigation strategy memorandum prepared in anticipation of litigation",No
PRIV-004,2024-07-05,john.doe@company.com,cfo@company.com,,Attorney-Client,"Legal advice on SEC disclosure obligations — forwarded from outside counsel",No
PRIV-005,2024-07-10,hr.director@company.com,john.doe@company.com,,"Business Purpose Only","Meeting notes from HR planning session — no legal advice sought or given",No
PRIV-006,2024-07-15,gc@company.com,board@company.com,,Attorney-Client,"Privileged board briefing on pending litigation matters",No
PRIV-007,2024-07-20,paralegal@company.com,outside.counsel@firm.com,,Work Product,"Document compilation prepared at direction of counsel for litigation",No
PRIV-008,2024-08-01,john.doe@company.com,marketing@company.com,,,"Marketing copy review — compliance suggestions (no privilege claimed)",Yes
PRIV-009,2024-08-05,outside.counsel@firm.com,john.doe@company.com;ceo@company.com;investor@external.com,,"Attorney-Client?","Legal analysis shared with non-company third party — potential waiver",No
PRIV-010,2024-08-10,gc@company.com,outside.counsel@firm.com,,Attorney-Client + Work Product,"Dual-purpose communication — legal advice on investigation strategy",No
PRIV-011,2024-08-15,john.doe@company.com,engineering@company.com,,,"Technical discussion about system architecture — mentions pending lawsuit in passing",No
PRIV-012,2024-08-20,gc@company.com,all-hands@company.com,,,"Company-wide announcement about policy changes — references legal department review",Yes
PRIV-013,2024-09-01,outside.counsel@firm.com,john.doe@company.com,,Work Product,"Expert witness evaluation memorandum",No
PRIV-014,2024-09-05,john.doe@company.com,gc@company.com,,Attorney-Client,"Summary of settlement negotiation positions and legal risk assessment",No
PRIV-015,2024-09-10,consultant@thirdparty.com,john.doe@company.com,outside.counsel@firm.com,Attorney-Client (via Kovel),"Forensic accounting analysis prepared under Kovel doctrine at counsel direction",No`;

export const SAMPLE_OC_SPEND = `INVOICE_ID,FIRM,MATTER,PERIOD,AMOUNT,BUDGET_TOTAL,BUDGET_SPENT,HOURS,AVG_RATE,PARTNER_HOURS,ASSOCIATE_HOURS,PARALEGAL_HOURS,GUIDELINE_FLAGS
INV-2025-101,Baker McKenzie,Acme Patent Litigation,2025-04,85000,500000,340000,142,598,35,85,22,None
INV-2025-102,Baker McKenzie,Acme Patent Litigation,2025-05,92000,500000,432000,148,622,42,80,26,"Rate increase — partner rate $50 over agreed cap"
INV-2025-103,Dentons,IP Portfolio Prosecution,2025-04,45000,320000,180000,95,474,15,60,20,None
INV-2025-104,Dentons,IP Portfolio Prosecution,2025-05,38000,320000,218000,78,487,12,50,16,None
INV-2025-105,Latham & Watkins,DOJ Antitrust Investigation,2025-04,175000,800000,520000,210,833,80,100,30,"Block billing on 3 entries; excessive research (18hrs)"
INV-2025-106,Latham & Watkins,DOJ Antitrust Investigation,2025-05,165000,800000,685000,195,846,75,95,25,"Potential duplicate: Doc review charge matches INV-2025-105 line 14"
INV-2025-107,Wilson Sonsini,Series C Financing,2025-04,55000,150000,110000,88,625,20,55,13,None
INV-2025-108,Wilson Sonsini,Series C Financing,2025-05,62000,150000,172000,95,653,25,58,12,"Over budget — $22K (14.7%) above total budget"
INV-2025-109,Littler Mendelson,Employment Class Action,2025-04,72000,400000,195000,128,563,30,75,23,None
INV-2025-110,Littler Mendelson,Employment Class Action,2025-05,68000,400000,263000,120,567,28,70,22,None
INV-2025-111,Baker McKenzie,Regulatory Compliance,2025-05,42000,200000,125000,70,600,18,40,12,None
INV-2025-112,DLA Piper,EU AI Act Compliance,2025-05,88000,250000,88000,105,838,40,50,15,"New matter — first invoice. Staffing leverage review recommended"`;
