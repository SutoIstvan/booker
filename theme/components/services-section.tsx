import { Clock } from 'lucide-react'
import { services, formatPrice } from '@/lib/salon-data'

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Our services
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Massage & SPA programs for body and soul
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Choose the treatment that suits you — every program is tailored to your
            feelings and goals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md"
            >
              {service.image ? (
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={service.image || '/placeholder.svg'}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center bg-secondary">
                  <span className="font-serif text-5xl text-primary/30">
                    {service.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  {service.duration}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {service.name}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-lg font-semibold text-foreground">
                    {formatPrice(service.price)}
                  </span>
                  <a
                    href="#booking"
                    className="text-sm font-medium text-primary transition-colors hover:text-accent"
                  >
                    Book now →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
