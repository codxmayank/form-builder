# AI Usage Log

Documented how I used AI during development — what I asked for, what it got right, what it got wrong and where I had to correct and update.

## General Approach

I made upfront decisions in Architecture planning and tech choices and design the app — the folder structure, type system, and store boundaries.

Once these were in place, AI was useful for filling in the implementation details.

I used AI primarily for two things: scaffolding repetitive patterns (the nine config/renderer file pairs follow a very similar shape), export PDF logic help and debugging tricky logic issues. And then I reviewed generated code before committing.

I've also setup pre-commit hook (typecheck + lint (prettier)) which caught few things that AI produced.

## Significant Prompts and Outcomes

### 1. Structuring the condition system

Described condition model (target field + operator) and AI helped build the evaluation function.

**What went well:** It generated the operator field type mapping and the switch based evaluator. The structure was good so I kept most of the part.

**Parts where I need to correct:** AI wanted to store calculation visibility defaults as a new property on the field, which would've needed data migrations. I kept the calculated ones at evaluation time instead and its simpler.

I also had to fix the conditions editor to use option IDs instead of labels for select fields, which AI missed because it doesn't trace data across files.

### 2. PDF export

I asked for help building the print-to-PDF generation — rendering form values into a standalone HTML page for `window.print()`.

**What went well:** The iframe approach with inline styles worked on first pass.

**What went wrong:** AI grouped select fields with text/date in a switch fall-through, so select fields just printed raw UUIDs instead of labels. The first fix attempt then broke text/date fields by accessing `.options` on types that don't have it. I restructured it so each field type gets its own case — proper type narrowing, no more crashes.

### 3. Date prefill bug

Date fields with `prefillToday` enabled weren't actually prefilling on new forms. AI added the right logic to the init function, but the edit introduced a `};,` (semicolon-comma) — something no one would type by hand. TypeScript caught it, took a couple rounds to clean up. Classic example of AI struggling with inserting code into existing files.

### 4. Conditions not matching at runtime

Conditions like "show when Country equals India" never triggered. Turned out the condition editor stored option labels ("India") while the form stored option IDs (UUIDs). Each file looked fine individually, but the data didn't match across the chain. Simple fix once identified — use IDs everywhere — but AI didn't catch it because the bug spans three files.

### 5. Condition visibility defaults

Fields with "show" conditions stayed visible, making the conditions useless. AI's fix was to infer the starting state from the effects — "show" conditions start the field hidden, "hide" conditions start it visible. This was correct and I kept it as-is.

### 6. Dark mode and UI polish

Hover states were broken in dark mode across several components. Also the file types input was splitting on every comma keystroke while typing. AI fixed both — added dark hover variants and switched the input to a commit-on-blur pattern. I reviewed the color choices to make sure they matched the existing palette.

## What I Changed or Rejected

- **PDF switch fall-through** — AI treated select fields same as text, printing UUIDs. Had to separate each field type into its own case.
- **Condition defaults as stored data** — AI suggested adding a new field property. I kept the inference at runtime instead.
- **The `};,` syntax error** — AI inserted a semicolon-comma inside an object literal when editing the form init function. TypeScript caught it immediately.

## What Worked and What Didn't

**Worked well:**

- Generating repetitive files — once the first config/renderer pair was done, AI followed the same patterns for the rest
- Tailwind class suggestions, especially dark mode and responsive variants
- Autocomplete accuracy because of strict discriminated union types

**Didn't work well:**

- Editing existing code — inserting into the middle of a file was error-prone, especially around syntax boundaries. Fresh files were more reliable.
- Bugs spanning multiple files — AI looks at each file in isolation and can produce code that type-checks but is semantically wrong across the system
