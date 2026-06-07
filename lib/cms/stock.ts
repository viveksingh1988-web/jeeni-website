/* Built-in stock asset library (Unsplash HD + 3D-render images), shown in the
 * DAM so the owner can pick professional imagery without uploading. All URLs
 * are on images.unsplash.com (already whitelisted in next.config). */

export type StockItem = {
  id: string; // unsplash photo id
  label: string;
  group: string;
};

/** Display order + labels for the group sub-tabs (derived dynamically too). */
export const STOCK_GROUPS: { id: string; label: string }[] = [
  { id: "business", label: "Business" },
  { id: "tech", label: "AI / Tech" },
  { id: "people", label: "People" },
  { id: "abstract", label: "Abstract" },
  { id: "3d", label: "3D renders" },
];

const U = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export function stockFull(id: string) {
  return U(id, 1600);
}
export function stockThumb(id: string) {
  return U(id, 400);
}

export const STOCK: StockItem[] = [
  // --- Business / office (verified IDs used across the site) ---
  { id: "1497366216548-37526070297c", label: "Modern office", group: "business" },
  { id: "1497366811353-6870744d04b2", label: "Office interior", group: "business" },
  { id: "1521737604893-d14cc237f11d", label: "Meeting room", group: "business" },
  { id: "1600880292203-757bb62b4baf", label: "Handshake", group: "business" },
  { id: "1460925895917-afdab827c52f", label: "Dashboard analytics", group: "business" },
  { id: "1551288049-bebda4e38f71", label: "Charts & graphs", group: "business" },
  { id: "1454165804606-c3d57bc86b40", label: "Data on screen", group: "business" },
  { id: "1486406146926-c627a92ad1ab", label: "Glass tower", group: "business" },
  { id: "1431540015161-0bf868a2d407", label: "Architecture", group: "business" },
  { id: "1453928582365-b6ad33cbcf64", label: "Boardroom", group: "business" },

  // --- AI / tech ---
  { id: "1620712943543-bcc4688e7485", label: "Neural / AI", group: "tech" },
  { id: "1591453089816-0fbb971b454c", label: "Circuit board", group: "tech" },
  { id: "1518770660439-4636190af475", label: "Microchip", group: "tech" },
  { id: "1526374965328-7f61d4dc18c5", label: "Code / matrix", group: "tech" },
  { id: "1550751827-4bd374c3f58b", label: "Server room", group: "tech" },
  { id: "1488229297570-58520851e868", label: "Workstation", group: "tech" },
  { id: "1517694712202-14dd9538aa97", label: "Developer desk", group: "tech" },

  // --- People / team ---
  { id: "1522071820081-009f0129c71c", label: "Creative team", group: "people" },
  { id: "1556761175-5973dc0f32e7", label: "Team working", group: "people" },
  { id: "1507003211169-0a1dd7228f2d", label: "Portrait", group: "people" },
  { id: "1573164713988-8665fc963095", label: "Analyst at work", group: "people" },
  { id: "1521791136064-7986c2920216", label: "Collaboration", group: "people" },
  { id: "1600880292089-90a7e086ee0c", label: "Consultation", group: "people" },

  // --- Abstract / gradient ---
  { id: "1557672172-298e090bd0f1", label: "Gradient waves", group: "abstract" },
  { id: "1550859492-d5da9d8e45f3", label: "Color flow", group: "abstract" },
  { id: "1505506874110-6a7a69069a08", label: "Smoke", group: "abstract" },
  { id: "1604079628040-94301bb21b91", label: "Liquid art", group: "abstract" },
  { id: "1614851099175-e5b30eb6f696", label: "Neon lines", group: "abstract" },

  // --- 3D renders ---
  { id: "1633356122544-f134324a6cee", label: "3D abstract blue", group: "3d" },
  { id: "1620641788421-7a1c342ea42e", label: "3D waves", group: "3d" },
  { id: "1635776062127-d379bfcba9f8", label: "3D fluid", group: "3d" },
  { id: "1639762681485-074b7f938ba0", label: "3D gradient orbs", group: "3d" },
  { id: "1618005182384-a83a8bd57fbe", label: "3D geometric", group: "3d" },
  { id: "1617791160588-241658c0f566", label: "3D shapes", group: "3d" },
  { id: "1620121692029-d088224ddc74", label: "3D mesh", group: "3d" },
  { id: "1634986666676-ec8fd927c23d", label: "3D metallic", group: "3d" },
];
