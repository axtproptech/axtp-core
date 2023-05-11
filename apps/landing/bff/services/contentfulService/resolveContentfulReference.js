export function resolveContentfulReference(includes, ref) {
  const linkTypes = includes[ref.linkType];
  const found = linkTypes.find((l) => l.sys.id === ref.id);
  return found ? found.fields : null;
}
