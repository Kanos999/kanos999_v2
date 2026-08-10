import { CornerTicks } from "./Marks";
import { person, socials } from "@/data/site";

/**
 * The one literal borrowing from a drawing sheet: a title block.
 * It earns the place because a footer is genuinely a metadata block.
 */
const Field = ({ name, value, href, className = "" }) => (
  <div className={`px-5 py-4 ${className}`}>
    <div className="label text-ink/30">{name}</div>
    <div className="mt-2 text-[13px] leading-snug text-ink/70">
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="link-draw hover:text-ink"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </div>
  </div>
);

export default function Footer({ sheet = "1 of 2", rev = "D", title = "Personal Site" }) {
  return (
    <footer className="mx-auto max-w-sheet px-6 pb-16 pt-14 md:px-10 md:pb-20 md:pt-20">
      <div className="relative border border-rule/12">
        <CornerTicks inset="-4px" />

        <div className="grid grid-cols-2 md:grid-cols-4">
          <Field name="Drawn by" value={person.name} className="border-b border-r border-rule/10" />
          <Field name="Title" value={title} className="border-b border-rule/10 md:border-r" />
          <Field
            name="Contact"
            value={person.email}
            href={`mailto:${person.email}`}
            className="border-b border-r border-rule/10 md:border-b-0"
          />
          <Field name="Location" value={person.location} className="border-b border-rule/10 md:border-b-0" />

          <Field name="Scale" value="1:1" className="border-r border-rule/10" />
          <Field name="Sheet" value={sheet} className="border-r border-rule/10" />
          <Field name="Rev" value={rev} className="border-r border-rule/10" />
          <Field name="Units" value="mm / SI" />
        </div>

        <div className="flex flex-col gap-4 border-t border-rule/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="label link-draw text-ink/45 hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="label text-ink/25">
            Set in Figtree &amp; Instrument Serif
          </div>
        </div>
      </div>
    </footer>
  );
}
