import { NextResponse } from 'next/server';
import { AirtableLead, Lead } from '@/lib/types';

export async function GET() {
  const token = process.env.AIRTABLE_API_TOKEN;

  if (!token || token === 'YOUR_SECRET_API_TOKEN') {
    return NextResponse.json({ error: 'Airtable API token not configured.' }, { status: 500 });
  }

  const fields = [
    'full_name',
    'timezone',
    'lead_type',
    'lead_id',
    'contact_type',
    'company_name',
    'role',
    'phone',
    'email',
    'call_notes_sidago',
    'not_work_anymore',
    'next_follow_up_date_sidago',
    'last_called_date_sidago',
    'history_call_notes_sidago',
    'history_calls_sidago',
    'last_fixed_date',
    'other_contacts',
  ];

  const fieldParams = fields.map((f) => `fields[]=${encodeURIComponent(f)}`).join('&');
  const url = `https://api.airtable.com/v0/appsYLUc51HNGLNcO/tblZYbsE94C8WIXcf?view=Call%20UI%20-%20Bryan&${fieldParams}&maxRecords=100`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Airtable error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const records: AirtableLead[] = data.records ?? [];

    const leads: Lead[] = records.map((r) => ({
      recordId: r.id,
      lead_id: r.fields.lead_id ?? r.id,
      full_name: r.fields.full_name ?? '—',
      timezone: r.fields.timezone ?? '—',
      lead_type: r.fields.lead_type ?? '—',
      contact_type: r.fields.contact_type ?? '—',
      company_name: r.fields.company_name ?? '—',
      role: r.fields.role ?? '—',
      phone: r.fields.phone ?? '—',
      email: r.fields.email ?? '',
      call_notes_sidago: r.fields.call_notes_sidago ?? '',
      not_work_anymore: r.fields.not_work_anymore ?? false,
      next_follow_up_date_sidago: r.fields.next_follow_up_date_sidago ?? '',
      last_called_date_sidago: r.fields.last_called_date_sidago ?? '—',
      history_call_notes_sidago: r.fields.history_call_notes_sidago ?? '—',
      history_calls_sidago: r.fields.history_calls_sidago ?? '—',
      last_fixed_date: r.fields.last_fixed_date ?? '—',
      other_contacts: r.fields.other_contacts ?? '—',
    }));

    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch: ${err}` }, { status: 500 });
  }
}
