---
tags: [varix, blog, images, design, midjourney, prompts]
---

# Blog Cover Image Prompts

Text-to-image prompts for generating blog cover images in the [[Brand Identity|Varix visual style]]. 13 of 18 blog posts need generated covers.

## Shared Visual Style

Prepend to every prompt:

> Dark, minimal, near-black background (#050505). Single warm gold accent (#FFBF47) sparingly against near-black and graphite surfaces. Subtle CRT scanline texture overlay. Thin glass/wireframe geometric forms — translucent cubes and hairline connecting lines, evoking technical, engineered feeling. Restrained, editorial, almost architectural composition — plenty of negative space. Serif display typography feel (Cormorant Garamond) paired with monospace labels (JetBrains Mono) if text appears. 16:9 landscape.
>
> Negative: cartoonish, cheerful, colorful, stock photography, corporate clipart, bright blue, generic tech icons, people, faces, watermarks, text-heavy.

## Per-Post Prompts

| # | Post | File | Subject Addition |
|---|------|------|-----------------|
| 1 | What Is n8n | `/blog/what-is-n8n-cover.jpg` | Glowing gold nodes connected by thin wireframe lines — data flowing between systems |
| 2 | RAG Explained | `/blog/what-is-rag-cover.jpg` | Translucent glass document panes floating, single gold search ray highlighting one pane |
| 3 | Hybrid Search vs Agentic RAG | `/blog/hybrid-search-vs-agentic-rag-cover.jpg` | Split: orderly grid of gold cubes vs branching tree network, thin hairline divider |
| 4 | From Arduino to the Cloud | `/blog/embedded-systems-cover.jpg` | Circuit-board pattern transitioning upward into glass-cube motif |
| 5 | Web Platform vs Native App | `/blog/web-vs-native-cover.jpg` | Rectangle (browser) and rounded-rectangle (phone) connected by thin gold line |
| 6 | Web Dev Agency in Los Baños | `/blog/web-dev-agency-los-banos-cover.jpg` | Abstract topographic/map-contour lines in gold hairlines, single glowing gold node |
| 7 | AI Automation in the Philippines | `/blog/ai-automation-philippines-cover.jpg` | Small glass cubes connecting into one larger central gold node |
| 8 | Mobile App Development Cost | `/blog/mobile-app-cost-cover.jpg` | Ascending gold-outlined glass panels — budget tiers, not literal bar chart |
| 9 | Nonprofit Website Development | `/blog/nonprofit-web-dev-cover.jpg` | Small constellation of glass cubes in loose circular/community formation |
| 10 | 4-Phase Process | `/blog/4-phase-process-cover.jpg` | Four glass cubes in horizontal line, gold line draws left-to-right, brightens progressively |
| 11 | Why We Build Automation-First | `/blog/automation-first-cover.jpg` | Abstract gear/interlocking-mechanism from thin gold wireframe lines and translucent cube facets |
| 12 | n8n vs Custom Code | `/blog/n8n-vs-custom-code-cover.jpg` | Tidy grid of uniform cubes vs single intricate wireframe form, divided by thin hairline |
| 13 | RAG vs Fine-Tuning vs Prompt Engineering | `/blog/rag-vs-finetuning-cover.jpg` | Three glass-cube clusters in loose triangle, each different density, faint connecting hairlines |

## Workflow

1. Generate image (16:9), save to `D:\VARIX\public\blog\`
2. Update `cover_image` and `cover_image_alt` in Supabase
3. `git add` + push (triggers Vercel redeploy — blog pages are statically prerendered)
4. Verify live with curl check

**Done:** #1 (n8n), #2 (RAG), #3 (hybrid search), #10 (4-phase) — deployed
**Pending:** #4, #5, #6, #7, #8, #9, #11, #12, #13

## Related Nodes

- [[Brand Identity]] — the visual style being applied
- [[Varix Website Project]] — the site hosting the blog
- [[Voice & Positioning]] — tone for the blog content
