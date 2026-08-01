import Nav from '../../components/Nav.js'

export const metadata = {
  title: 'Privacy Policy — Snowscape',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-page">
      <Nav />
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-surface border border-line rounded-2xl p-8 sm:p-10">
          <h1 className="font-display font-bold text-2xl text-ink mb-1">Privacy Policy</h1>
          <p className="text-sm text-ink-faint mb-8">Effective July 31, 2026</p>

          <div className="space-y-8 text-ink-muted text-[15px] leading-relaxed">
            <section>
              <p>
                Snowscape (&quot;we,&quot; &quot;us&quot;) provides live ski conditions for Pacific Northwest resorts.
                This policy explains what information we collect when you use snowscape.info,
                how we use it, and the choices you have. Snowscape is operated by an individual,
                not a company.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Information we collect</h2>
              <p className="mb-3">We collect as little as possible. If you create an account, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-ink">Email address</strong> — used to log you in and, if you opt in, to send storm alerts.</li>
                <li><strong className="text-ink">Password</strong> — hashed and managed by our authentication provider, Supabase. We never see or store your password in plain text.</li>
                <li><strong className="text-ink">Zip code</strong> — collected at sign-up so we can show you approximate distance from home to each resort. We use your zip code&apos;s general area only, not a precise or street-level location.</li>
                <li><strong className="text-ink">Saved resorts</strong> — the resort IDs you save, linked to your account. No other personal data is attached to this list.</li>
              </ul>
              <p className="mt-3">
                We do not collect your name, street address, phone number, precise
                (GPS-level) location, or payment information. Browsing the site without an
                account does not require any personal information.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">How we use it</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To create and maintain your account and keep you logged in.</li>
                <li>To remember which resorts you&apos;ve saved.</li>
                <li>To calculate approximate distance from your zip code to each resort.</li>
                <li>To send storm alert emails, only if you opt in to that feature.</li>
                <li>To respond if you contact us with a question or request.</li>
              </ul>
              <p className="mt-3">We do not sell or rent your information to anyone.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Third-party services</h2>
              <p className="mb-3">Snowscape relies on the following services to operate:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-ink">Supabase</strong> — hosts our database and handles account authentication (password storage, sessions).</li>
                <li><strong className="text-ink">Vercel</strong> — hosts the website.</li>
                <li><strong className="text-ink">Mapbox</strong> — provides the map on our Map view. Loading the map may share your IP address with Mapbox per their own privacy policy.</li>
                <li><strong className="text-ink">Mapbox (Geocoding)</strong> — your zip code is sent to Mapbox&apos;s geocoding API to resolve it to an approximate location so we can calculate distance to each resort. Mapbox&apos;s <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-ice underline hover:opacity-80">privacy policy</a> also applies to this data.</li>
                <li><strong className="text-ink">Open-Meteo, WSDOT, ODOT, Liftie.info</strong> — public weather, road, and lift-status data sources. No personal information is sent to these services.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Cookies &amp; local storage</h2>
              <p>
                We store your light/dark theme preference in your browser&apos;s local storage —
                this stays on your device and isn&apos;t sent to us. If you have an account, your
                login session is kept using a secure token managed by Supabase Auth. We don&apos;t
                use tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Your rights</h2>
              <p>
                Regardless of where you live, you can ask us to access, correct, or delete
                your account and its data at any time. California residents have these rights
                under the CCPA; EU/EEA residents have these rights under the GDPR. To make a
                request, email <strong className="text-ink">support@snowscape.info</strong>. We&apos;ll
                process deletion requests promptly — deleting your account removes your saved
                resorts along with it.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Children&apos;s privacy</h2>
              <p>
                Snowscape is not directed at children. You must be at least 13 years old to
                create an account.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">International users</h2>
              <p>
                Snowscape is operated from the United States and your data is processed on
                U.S.-based infrastructure (Supabase, Vercel). By using the site, you consent
                to this transfer and processing.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Data retention</h2>
              <p>
                We keep your account data for as long as your account is active. If you
                delete your account, we remove your account record and saved resorts from our
                database.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Changes to this policy</h2>
              <p>
                If we make material changes to this policy, we&apos;ll update the effective date
                above. Continued use of Snowscape after changes means you accept the updated
                policy.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-lg text-ink mb-2">Contact</h2>
              <p>Questions or requests: <strong className="text-ink">support@snowscape.info</strong></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
