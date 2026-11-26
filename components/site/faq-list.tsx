export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
