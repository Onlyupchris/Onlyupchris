export const DEAL_STAGES = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
]

export const CLIENT_STATUSES = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'active', label: 'Active' },
  { id: 'at_risk', label: 'At Risk' },
  { id: 'churned', label: 'Churned' },
]

export const AGREEMENT_TEMPLATES = {
  retainer: `# Social Media Management Retainer Agreement

**Agency:** Rivonia AI
**Client:** [CLIENT_NAME]
**Date:** [DATE]
**Monthly Retainer:** R[AMOUNT]

---

## 1. Services

Rivonia AI agrees to provide the following services:

- Strategic social media management across agreed platforms
- Content creation (copy + creative direction)
- Community management and engagement
- Monthly performance reporting
- Strategic consultation (2x per month)

## 2. Payment Terms

- Monthly retainer payable on the 1st of each month
- 30-day notice period required for cancellation
- Late payments incur 5% monthly interest after 7 days

## 3. Intellectual Property

All content created by Rivonia AI for the Client remains the property of the Client upon full payment of fees.

## 4. Confidentiality

Both parties agree to maintain confidentiality of all proprietary information.

## 5. Signatures

**Rivonia AI:** _____________________  Date: ___________

**Client:** _____________________  Date: ___________`,

  project: `# Project Agreement

**Agency:** Rivonia AI
**Client:** [CLIENT_NAME]
**Project:** [PROJECT_NAME]
**Date:** [DATE]
**Project Fee:** R[AMOUNT]

---

## 1. Project Scope

[DETAILED_SCOPE]

## 2. Timeline

- Start Date: [START_DATE]
- Completion Date: [END_DATE]
- Key Milestones: [MILESTONES]

## 3. Payment Schedule

- 50% deposit upon signing
- 50% balance upon project completion

## 4. Revisions

This agreement includes [NUMBER] rounds of revisions. Additional revisions billed at R[RATE]/hour.

## 5. Signatures

**Rivonia AI:** _____________________  Date: ___________

**Client:** _____________________  Date: ___________`,
}

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const AI_TOOLS = [
  {
    id: 'content-generator',
    label: 'Content Generator',
    description: 'AI-powered captions, ad copy, and email sequences tailored to your client\'s brand',
    icon: 'Pen',
    href: '/ai-tools/content-generator',
    color: '#4DD9D9',
  },
  {
    id: 'growth-advisor',
    label: 'Growth Advisor',
    description: 'Deep analysis of your agency revenue data with specific actions to scale MRR',
    icon: 'TrendingUp',
    href: '/ai-tools/growth-advisor',
    color: '#F0C040',
  },
  {
    id: 'report-generator',
    label: 'Report Generator',
    description: 'Auto-generate premium monthly client reports in seconds, not hours',
    icon: 'FileBarChart',
    href: '/ai-tools/report-generator',
    color: '#A78BFA',
  },
  {
    id: 'lead-qualifier',
    label: 'Lead Qualifier',
    description: 'AI chatbot that qualifies inbound leads and scores them before your sales call',
    icon: 'MessageSquare',
    href: '/ai-tools/lead-qualifier',
    color: '#34D399',
  },
]
