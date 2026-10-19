export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border/50 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-content-dim text-xs font-body">&copy; {year} xDINAR. All rights reserved.</p>
        <p className="text-content-dim text-xs font-body text-center sm:text-right max-w-lg leading-relaxed">
          <strong className="text-content-muted">Disclaimer:</strong> This website is for informational purposes only
          and does not constitute financial, legal, or tax advice or an offer of securities. Crypto assets carry
          significant risk, including loss of all capital. Do your own research.
        </p>
      </div>
    </footer>
  )
}
