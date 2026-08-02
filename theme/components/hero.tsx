import { Clock, MapPin, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <Star className="h-4 w-4 fill-accent" aria-hidden="true" />
            Massage & SPA Salon
          </span>

          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            Bring lightness to your body and stillness to your mind
          </h1>

          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Personalized massage and SPA programs in an atmosphere of calm.
            Experienced therapists, natural oils and easy online booking for any
            available time.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book a time
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              View services
            </a>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Open daily 10:00–22:00
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              12 Quiet Street, Downtown
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border/60 shadow-sm">
            <img
              src="/images/hero-massage.png"
              alt="Cozy, bright massage room with soft natural light"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" aria-hidden="true" />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">4.9 out of 5</p>
              <p className="text-muted-foreground">800+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
