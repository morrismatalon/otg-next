-- ============================================================
-- Off The Grid — seed data
-- Run AFTER schema.sql
-- ============================================================

-- Designers
insert into designers (id, name, studio_number, location, city, country, specialty, categories, commissions, bio, instagram) values
(
  'yuto-mori', 'Yuto Mori', '0031', 'Tokyo, Japan', 'Tokyo', 'Japan',
  'Outerwear', array['Outerwear'], true,
  'Working from a small studio in Shimokitazawa since 2018. Yuto builds outerwear around the tension between utility and ceremony — pieces made to be worn hard and kept forever. Every garment is cut, assembled, and finished by hand.',
  null
),
(
  'reiko-aoki', 'Reiko Aoki', '0019', 'Osaka, Japan', 'Osaka', 'Japan',
  'Separates', array['Tops','Bottoms'], false,
  'Reiko trained in pattern-cutting in Kyoto before returning to Osaka to build a practice around separates. Her work focuses on drape, raw edges, and fabrics sourced from regional mills. Listings only — no commissions.',
  null
),
(
  'dara-osei', 'Dara Osei', '0047', 'London, UK', 'London', 'UK',
  'Tailoring', array['Tops','Outerwear'], true,
  'East London. Trained through apprenticeship, not school. Dara''s tailoring comes from British workwear and West African formal dress — two traditions he treats with equal seriousness. Studio accepts commissions on a case-by-case basis.',
  null
),
(
  'n-ferreira', 'N. Ferreira', '0052', 'Lisbon, Portugal', 'Lisbon', 'Portugal',
  'Accessories', array['Accessories'], false,
  'Nuno works from a shared studio in Mouraria. His practice centres on accessories — bags, straps, and small leather goods — made in very limited runs. Influences range from Portuguese saddlery to 1990s Tokyo streetwear.',
  null
),
(
  'mia-krause', 'Mia Krause', '0038', 'Berlin, Germany', 'Berlin', 'Germany',
  'Knitwear', array['Tops','Outerwear'], true,
  'Mia knits everything by hand from a studio in Neukölln. She works with undyed wool sourced from small farms in Germany and Poland. Slow production, deliberately limited quantities. She accepts commissions for custom colourways.',
  null
),
(
  'jihoon-park', 'Jihoon Park', '0061', 'Seoul, South Korea', 'Seoul', 'South Korea',
  'Bottoms', array['Bottoms'], false,
  'Jihoon studied textile engineering before moving into independent production. His trousers and shorts are engineered with precision — technical fabrics, unconventional seaming, functional silhouettes. Based in Mapo-gu.',
  null
)
on conflict (id) do nothing;

-- Listings
insert into listings (id, designer_id, title, description, price, currency, price_display, category, city, images) values
-- Yuto Mori
('panel-bomber-iridescent','yuto-mori','Panel bomber, iridescent shell','Four-panel construction in a Japanese iridescent shell fabric. Interior is unlined to keep weight low. Two chest pockets with press-stud closures. Fits true to size. One of three made.',42000,'JPY','¥ 42,000','Outerwear','Tokyo',array['/card-1.jpg']),
('asymmetric-coat-wool','yuto-mori','Asymmetric coat, boiled wool','Boiled wool from Niigata, asymmetric front closure, dropped shoulder. The hem sits lower on the right side by intent. Hand-finished seams. One size — fits M through XL depending on preference.',68000,'JPY','¥ 68,000','Outerwear','Tokyo',array['/card-3.jpg']),
('field-jacket-ripstop','yuto-mori','Field jacket, ripstop cotton','Ripstop cotton in washed olive. Four exterior pockets, one interior map pocket. Straight fit, slightly oversized. Made in an edition of five.',34000,'JPY','¥ 34,000','Outerwear','Tokyo',array['/card-2.jpg']),
('liner-vest-quilted','yuto-mori','Liner vest, quilted nylon','Quilted nylon liner vest in off-black. Designed to wear under the panel bomber or alone. Press-stud front, two hand pockets. Fits S–XL.',22000,'JPY','¥ 22,000','Outerwear','Tokyo',array['/card-4.jpg']),
-- Reiko Aoki
('satin-wide-leg','reiko-aoki','Satin wide leg, raw hem','Wide-leg trousers in a heavyweight satin from a Nishijin mill. Raw hem, elasticated waistband with a tie. Cut for a relaxed, low-crotch silhouette. Hand-washed before shipping.',18500,'JPY','¥ 18,500','Bottoms','Osaka',array['/card-2.jpg']),
('draped-top-gauze','reiko-aoki','Draped top, cotton gauze','Open-weave cotton gauze in undyed natural. One-piece drape construction, no closures. Intended to be worn tied or left open. Light enough to layer. One size.',12000,'JPY','¥ 12,000','Tops','Osaka',array['/card-3.jpg']),
('wrap-skirt-linen','reiko-aoki','Wrap skirt, washed linen','Washed linen wrap skirt in slate grey. Midi length, adjustable tie. Raw edges on all seams. Fits 26–34" waist.',16000,'JPY','¥ 16,000','Bottoms','Osaka',array['/card-1.jpg']),
('boxy-shirt-poplin','reiko-aoki','Boxy shirt, cotton poplin','Boxy-cut shirt in cotton poplin, off-white. Dropped shoulder, single chest pocket, no collar — just a wide band neck. Edition of eight.',14500,'JPY','¥ 14,500','Tops','Osaka',array['/card-4.jpg']),
-- Dara Osei
('hand-printed-oversized-tee','dara-osei','Hand-printed oversized tee','Screen-printed by hand in East London on a heavyweight organic cotton blank. The print references Ghanaian kente textile geometry. Each one varies slightly — no two are identical. Run of twelve.',185,'GBP','£ 185','Tops','London',array['/card-3.jpg']),
('structured-blazer-canvas','dara-osei','Structured blazer, canvas','Canvas blazer with internal structure — chest piece and bridle stay. Single button, jetted pockets. Made to order, 6–8 week lead time. British canvas, Japanese lining.',620,'GBP','£ 620','Outerwear','London',array['/card-1.jpg']),
('workwear-jacket-denim','dara-osei','Workwear jacket, raw denim','14oz raw denim workwear jacket. Four external pockets, triple-stitched at stress points. Will fade uniquely with wear. One size left.',340,'GBP','£ 340','Outerwear','London',array['/card-2.jpg']),
('pleated-trouser-twill','dara-osei','Pleated trouser, wool twill','Double-pleated trouser in a mid-weight British wool twill. High rise, straight leg. Made to measure at no extra cost — just include your measurements at checkout.',280,'GBP','£ 280','Tops','London',array['/card-4.jpg']),
-- N. Ferreira
('neon-deck-limited','n-ferreira','Neon deck, limited run','Structured tote in vegetable-tanned cow leather, fluorescent accents on the handles and gusset. Based on a Portuguese saddlebag form. Numbered edition of six. This is No. 4.',320,'EUR','€ 320','Accessories','Lisbon',array['/card-4.jpg']),
('shoulder-bag-bridle','n-ferreira','Shoulder bag, bridle leather','Traditional bridle leather shoulder bag. Single strap, brass hardware, three interior divisions. Will darken and deepen with use. Made entirely by hand.',480,'EUR','€ 480','Accessories','Lisbon',array['/card-1.jpg']),
('card-wallet-calf','n-ferreira','Card wallet, calf leather','Three-pocket card wallet in natural calf leather. Hand-stitched with linen thread. Minimal profile, good for four to six cards. Made in batches of twenty.',95,'EUR','€ 95','Accessories','Lisbon',array['/card-2.jpg']),
('wrist-strap-nylon','n-ferreira','Wrist strap, technical nylon','Camera or bag wrist strap in technical nylon webbing with a leather loop and brass clip. Adjustable length. One size.',65,'EUR','€ 65','Accessories','Lisbon',array['/card-3.jpg']),
-- Mia Krause
('hand-knit-pullover','mia-krause','Hand-knit pullover, undyed wool','Hand-knit from undyed Merino from a small farm in Sachsen. Relaxed fit, ribbed hem and cuffs, drop shoulder. Takes approximately three weeks per piece. One available now.',520,'EUR','€ 520','Tops','Berlin',array['/card-2.jpg']),
('oversized-cardigan-wool','mia-krause','Oversized cardigan, raw fleece','Double-weight raw fleece wool. Four bone buttons, deep pockets. Oversized deliberately — designed to wear over a shirt or light jacket. One size.',640,'EUR','€ 640','Outerwear','Berlin',array['/card-1.jpg']),
('wool-scarf-natural','mia-krause','Scarf, natural + charcoal','Hand-knit in natural and charcoal undyed wool. Long format, approx 220cm. Fringe ends. One of four.',185,'EUR','€ 185','Accessories','Berlin',array['/card-3.jpg']),
-- Jihoon Park
('technical-wide-trouser','jihoon-park','Technical wide trouser','Wide-leg trouser in a four-way stretch technical fabric. Flat front, articulated knees, tapered at the ankle. Engineered for movement — not streetwear posturing.',185000,'KRW','₩ 185,000','Bottoms','Seoul',array['/card-4.jpg']),
('cargo-shorts-ripstop','jihoon-park','Cargo shorts, ripstop','Six-pocket cargo shorts in Korean ripstop. Fitted waistband, utility pockets at thigh. Knee length. Sizes S–XL available.',120000,'KRW','₩ 120,000','Bottoms','Seoul',array['/card-2.jpg']),
('seamed-jogger-fleece','jihoon-park','Seamed jogger, French fleece','French fleece jogger with exposed exterior seaming. Drawstring waist, no cuff — clean hem. Heavy enough to wear alone in cool weather.',145000,'KRW','₩ 145,000','Bottoms','Seoul',array['/card-1.jpg'])
on conflict (id) do nothing;
