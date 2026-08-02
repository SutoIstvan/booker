import { Flower2, Phone, MapPin, Clock, Mail } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer id="contacts" className="scroll-mt-20 border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Flower2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl font-semibold text-foreground">
              Тишина
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Салон массажа и SPA. Место, где вы можете позволить себе замедлиться и
            восстановить силы.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-foreground">Контакты</h3>
          <a
            href="tel:+74950000000"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
            +7 (495) 000-00-00
          </a>
          <a
            href="mailto:hello@tishina-spa.ru"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            hello@tishina-spa.ru
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            Москва, ул. Тихая, 12
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-foreground">Часы работы</h3>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            Ежедневно 10:00 – 22:00
          </span>
          <a
            href="#booking"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Записаться онлайн
          </a>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground md:px-6">
          © {new Date().getFullYear()} Салон массажа «Тишина». Все права защищены.
        </div>
      </div>
    </footer>
  )
}
