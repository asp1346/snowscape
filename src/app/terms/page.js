import Nav from '../../components/Nav.js'

export const metadata = {
  title: 'Terms of Service — Snowscape',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-page">
      <Nav />
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-surface border border-line rounded-2xl p-8 sm:p-10">
          <h1 className="font-display font-bold text-2xl text-ink mb-1">Terms of Service</h1>
          <p className="text-sm text-ink-faint mb-8">Effective July 31, 2026</p>

          <div className="space-y-8 text-ink-muted text-[15px] leading-relaxed">
            <section>
              <p>
                These terms govern your use of Snowscape (snowscape.info). By using the site
                or creating an account, you agree to them. Snowscape is operated by an
                individual, not a company, and these terms should be read with that in mind.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">The service</h2>
              <p>
                Snowscape aggregates publicly available weather, road, and lift-status data
                for Pacific Northwest ski resorts for informational purposes. Snowscape is not
                affiliated with, endorsed by, or operated on behalf of any resort mentioned on
                the site.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Accounts</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You must be at least 13 years old to create an account.</li>
                <li>You&apos;re responsible for keeping your login credentials secure and for activity under your account.</li>
                <li>You agree to provide a valid email address and zip code, and not to create accounts using false information.</li>
                <li>You may delete your account at any time; doing so removes your saved data.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Acceptable use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Scrape, bulk-download, or reverse-engineer the site beyond normal browsing.</li>
                <li>Attempt to disrupt or overload the service (e.g. automated bot sign-ups, denial-of-service).</li>
                <li>Use the site for any unlawful purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">No warranty on conditions data</h2>
              <p>
                Snow depth, forecasts, road conditions, and lift status are sourced from
                third-party providers (Open-Meteo, WSDOT, ODOT, Liftie.info) and may be
                inaccurate, delayed, or unavailable. <strong className="text-ink">Snowscape is
                provided for informational purposes only and is not a substitute for official
                resort or department-of-transportation advisories.</strong> Always verify
                current conditions directly with the resort or official road-condition sources
                before traveling. Ski, snowboard, and mountain travel carry inherent risk — you
                assume that risk when you rely on information from this site. Distance-to-resort
                figures are estimated from your zip code&apos;s general area, not your exact address,
                and are approximate.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Limitation of liability</h2>
              <p>
                Snowscape is provided &quot;as is,&quot; without warranties of any kind. To the fullest
                extent permitted by law, Snowscape and its operator are not liable for any
                damages — direct or indirect — arising from your use of, or inability to use,
                the site, including reliance on any conditions data displayed.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Termination</h2>
              <p>
                We may suspend or delete accounts that violate these terms, without notice, at
                our discretion.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Changes to these terms</h2>
              <p>
                We may update these terms from time to time. We&apos;ll update the effective date
                above when we do. Continued use of Snowscape after changes means you accept
                the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Governing law</h2>
              <p>These terms are governed by the laws of the State of Oregon, without regard to conflict-of-law principles.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Contact</h2>
              <p>Questions: <strong className="text-ink">support@snowscape.info</strong></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
