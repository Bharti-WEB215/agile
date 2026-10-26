import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const jiraUrl = 'https://chini-sot.atlassian.net/jira/software/projects/SCRUM/boards/1';

const roles = [
  {
    title: 'Cashier',
    description: 'Build orders, manage the menu, and keep service moving.',
    icon: '💳',
    accent: 'blue',
    href: '/cashier',
    features: ['Menu & products', 'Order billing', 'QR order review'],
  },
  {
    title: 'Kitchen',
    description: 'See incoming tickets and move each order through preparation.',
    icon: '🍳',
    accent: 'emerald',
    href: '/kitchen',
    features: ['Live order queue', 'Preparation status', 'Ready to serve'],
  },
  {
    title: 'Tables',
    description: 'Organize seating, QR menus, and active dining sessions.',
    icon: '🪑',
    accent: 'violet',
    href: '/tables',
    features: ['Table overview', 'QR code access', 'Session settlement'],
  },
];

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-12 pb-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-6 py-12 shadow-xl shadow-indigo-950/5 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-400/20 dark:bg-white/5 dark:text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Restaurant operations
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              Every service,<br className="hidden sm:block" /> running smoothly.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              One calm workspace for front of house, kitchen, and table service. Choose where you want to jump in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-white/75 px-3 py-1.5 shadow-sm dark:bg-white/10">Fast order flow</span>
              <span className="rounded-full bg-white/75 px-3 py-1.5 shadow-sm dark:bg-white/10">Live kitchen queue</span>
              <span className="rounded-full bg-white/75 px-3 py-1.5 shadow-sm dark:bg-white/10">QR table service</span>
            </div>
          </div>
          <div className="absolute bottom-[-2rem] right-8 hidden text-[10rem] leading-none opacity-20 drop-shadow-xl dark:opacity-15 lg:block" aria-hidden="true">🍽️</div>
        </section>

        <section aria-labelledby="workspace-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Your workspace</p>
              <h2 id="workspace-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Choose a station</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pick a role to get started</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {roles.map(({ title, description, icon, accent, href, features }) => (
              <Link
                key={title}
                to={href}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 ${accent === 'blue' ? 'hover:border-blue-300 hover:shadow-blue-950/10' : accent === 'emerald' ? 'hover:border-emerald-300 hover:shadow-emerald-950/10' : 'hover:border-violet-300 hover:shadow-violet-950/10'}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-inner ${accent === 'blue' ? 'bg-blue-100 dark:bg-blue-400/15' : accent === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-400/15' : 'bg-violet-100 dark:bg-violet-400/15'}`} aria-hidden="true">{icon}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:translate-x-1 group-hover:bg-slate-900 group-hover:text-white dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900" aria-hidden="true">→</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-white/10">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className={`h-1.5 w-1.5 rounded-full ${accent === 'blue' ? 'bg-blue-500' : accent === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'}`} />{feature}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl dark:bg-blue-400/15" aria-hidden="true">📋</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Delivery tracking</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Team Astro · Jira</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">Open the connected Jira workspace to review the backlog, sprint, and delivery status for this project.</p>
            </div>
          </div>
          <a href={jiraUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            Open Jira board <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </Layout>
  );
}
