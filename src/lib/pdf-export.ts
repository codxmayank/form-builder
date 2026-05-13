import type { FormField, CalculationField } from '@/types/fields';
import type { FieldValue, FormInstance, FormTemplate } from '@/types/template';
import { resolveFieldState } from './conditions';
import { calculate } from './calculations';

/**
 * Opens a hidden iframe, renders form data as HTML, and triggers print dialog.
 * The browser's native print-to-PDF handles the rest.
 */
export function exportPdf(template: FormTemplate, values: Record<string, FieldValue>) {
  const html = buildPrintHtml(template, values);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.width = '0';
  iframe.style.height = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for styles to load, then print
  iframe.contentWindow?.addEventListener('afterprint', () => {
    document.body.removeChild(iframe);
  });

  // Small delay to ensure rendering
  setTimeout(() => {
    iframe.contentWindow?.print();
  }, 250);
}

/**
 * Exports all submissions for a template as a single PDF.
 * Each submission is rendered as a separate section with a page break.
 */
export function exportAllSubmissionsPdf(template: FormTemplate, instances: FormInstance[]) {
  const sections = instances
    .map((instance, idx) => {
      const rows = template.fields
        .map((field) => {
          const { visible } = resolveFieldState(field, instance.values);
          if (!visible) return '';
          return renderFieldRow(field, instance.values);
        })
        .filter(Boolean)
        .join('');

      return `<div class="submission${idx < instances.length - 1 ? ' page-break' : ''}">
        <h2 class="sub-heading">Submission #${idx + 1} &mdash; ${escapeHtml(new Date(instance.submittedAt).toLocaleString())}</h2>
        ${rows}
      </div>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(template.title || 'Form Submissions')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
    h1 { font-size: 22px; margin-bottom: 8px; border-bottom: 2px solid #111; padding-bottom: 8px; }
    .summary { font-size: 13px; color: #666; margin-bottom: 24px; }
    .sub-heading { font-size: 16px; font-weight: 700; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #ccc; color: #333; }
    .field { margin-bottom: 16px; page-break-inside: avoid; }
    .label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .value { font-size: 14px; color: #111; }
    .empty { font-size: 14px; color: #999; font-style: italic; }
    .section { font-size: 18px; font-weight: 700; margin-top: 24px; margin-bottom: 8px; }
    .section.sm { font-size: 16px; }
    .section.xs { font-size: 14px; }
    .section.lg { font-size: 20px; }
    .section.xl { font-size: 24px; }
    .submission { margin-bottom: 32px; }
    .page-break { page-break-after: always; }
    .timestamp { font-size: 11px; color: #888; margin-top: 32px; border-top: 1px solid #ddd; padding-top: 8px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(template.title || 'Form Submissions')}</h1>
  <p class="summary">${instances.length} submission${instances.length !== 1 ? 's' : ''}</p>
  ${sections}
  <p class="timestamp">Exported on ${new Date().toLocaleString()}</p>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.width = '0';
  iframe.style.height = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow?.addEventListener('afterprint', () => {
    document.body.removeChild(iframe);
  });

  setTimeout(() => {
    iframe.contentWindow?.print();
  }, 250);
}

function buildPrintHtml(template: FormTemplate, values: Record<string, FieldValue>): string {
  const rows = template.fields
    .map((field) => {
      const { visible } = resolveFieldState(field, values);
      if (!visible) return '';
      return renderFieldRow(field, values);
    })
    .filter(Boolean)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(template.title || 'Form Response')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
    h1 { font-size: 22px; margin-bottom: 24px; border-bottom: 2px solid #111; padding-bottom: 8px; }
    .field { margin-bottom: 16px; page-break-inside: avoid; }
    .label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .value { font-size: 14px; color: #111; }
    .empty { font-size: 14px; color: #999; font-style: italic; }
    .section { font-size: 18px; font-weight: 700; margin-top: 24px; margin-bottom: 8px; }
    .section.sm { font-size: 16px; }
    .section.xs { font-size: 14px; }
    .section.lg { font-size: 20px; }
    .section.xl { font-size: 24px; }
    .timestamp { font-size: 11px; color: #888; margin-top: 32px; border-top: 1px solid #ddd; padding-top: 8px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(template.title || 'Form Response')}</h1>
  ${rows}
  <p class="timestamp">Exported on ${new Date().toLocaleString()}</p>
</body>
</html>`;
}

function renderFieldRow(field: FormField, values: Record<string, FieldValue>): string {
  if (field.type === 'section-header') {
    return `<div class="section ${field.size}">${escapeHtml(field.label || 'Section')}</div>`;
  }

  if (field.type === 'calculation') {
    const calc = field as CalculationField;
    const sourceValues = calc.sourceFieldIds.map((id) => values[id] ?? null);
    const result = calculate(sourceValues, calc.aggregationType, calc.decimalPlaces);
    return `<div class="field">
      <div class="label">${escapeHtml(field.label || 'Calculation')}</div>
      <div class="value">${result != null ? result.toFixed(calc.decimalPlaces) : '—'}</div>
    </div>`;
  }

  const value = values[field.id] ?? null;
  const display = formatValue(field, value);

  return `<div class="field">
    <div class="label">${escapeHtml(field.label || 'Untitled')}</div>
    <div class="${display ? 'value' : 'empty'}">${display || 'No answer'}</div>
  </div>`;
}

function formatValue(field: FormField, value: FieldValue): string {
  if (value == null) return '';

  switch (field.type) {
    case 'single-line-text':
    case 'multi-line-text':
    case 'date':
    case 'single-select':
      return escapeHtml(String(value));

    case 'number':
      return escapeHtml(String(value));

    case 'multi-select':
      return Array.isArray(value) ? (value as string[]).map(escapeHtml).join(', ') : '';

    case 'file-upload':
      if (!Array.isArray(value) || value.length === 0) return '';
      return value.map((f) => escapeHtml((f as { name: string }).name)).join(', ');

    default:
      return escapeHtml(String(value));
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
