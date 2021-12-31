/**
 * Note that each section consists of [lineIdx, startIdx, endIdx]
 * @return List of non-overlapping sections from the given section compared to the unique sections
 * 
 * If the given section is completely overlapped by previous sections, then an empty list is returned
 */
export function findDistinctSections(uniqueSections, section) {
  const [sectionLineIdx, startIdx, endIdx] = section;

  for (const other of uniqueSections) {
    const [otherSectionLineIdx, otherStartIdx, otherEndIdx] = other;

    if (otherSectionLineIdx !== sectionLineIdx) {
      continue;
    }

    if (endIdx <= otherStartIdx || startIdx >= otherEndIdx) {
      continue;
    }

    const newSections = [];
    if (startIdx < otherStartIdx) {
      const before = [sectionLineIdx, startIdx, otherStartIdx];
      findDistinctSections(uniqueSections, before).forEach(s => newSections.push(s));
    }

    if (endIdx > otherEndIdx) {
      const after = [sectionLineIdx, otherEndIdx, endIdx];
      findDistinctSections(uniqueSections, after).forEach(s => newSections.push(s));
    }

    return newSections;
  }

  return [section];
}
