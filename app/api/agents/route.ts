import { NextResponse } from 'next/server';
import { AirtableAgent, Agent } from '@/lib/types';

export async function GET() {
  const token = process.env.AIRTABLE_API_TOKEN;

  if (!token || token === 'YOUR_SECRET_API_TOKEN') {
    return NextResponse.json({ error: 'Airtable API token not configured.' }, { status: 500 });
  }

  const url = `https://api.airtable.com/v0/appsYLUc51HNGLNcO/tblqWGpx4m4dv4UbE`;

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
    const records: AirtableAgent[] = data.records ?? [];

    const agents: Agent[] = records.map((r) => ({
      recordId: r.id,
      name: r.fields.name ?? '—',
      surname: r.fields.surname ?? '—',
      email: r.fields.email ?? '—',
      brand: r.fields.brand ?? '—',
      hot_leads_today: r.fields['Hot Leads Today'] ?? 0,
      today_calls_made: r.fields.today_calls_made ?? 0,
      winner: r.fields.winner ?? false,
      monthly_calls: r.fields.monthly_calls ?? 0,
      monthly_hot_leads: r.fields.monthly_hot_leads ?? 0,
      monthly_lost_hot_leads: r.fields.monthly_lost_hot_leads ?? 0,
      monthly_contract_closed: r.fields.monthly_contract_closed ?? 0,
      monthly_points: r.fields.monthly_points ?? 0,
      last_month_calls: r.fields.last_month_calls ?? 0,
      last_month_hot_lead: r.fields.last_month_hot_lead ?? 0,
      last_month_contract_closed: r.fields.last_month_contract_closed ?? 0,
      last_month_winner: r.fields.last_month_winner ?? false,
      last_month_points: r.fields.last_month_points ?? 0,
      monthly_winner: r.fields.monthly_winner ?? false,
      last_month_lost_lead: r.fields.last_month_lost_lead ?? 0,
      count_wins: r.fields.count_wins ?? 0,
      all_points: r.fields.all_points ?? 0,
    }));

    return NextResponse.json({ agents });
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch: ${err}` }, { status: 500 });
  }
}
