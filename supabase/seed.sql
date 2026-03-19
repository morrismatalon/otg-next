-- ============================================================
-- Off The Grid — seed data
-- Run AFTER schema.sql and updates.sql
-- Safe to run multiple times (idempotent via on conflict do nothing)
-- ============================================================

-- ── Designers ────────────────────────────────────────────────
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
),
-- New designers
(
  'saoirse-omurchu', 'Saoirse Ó Murchú', '0073', 'Dublin, Ireland', 'Dublin', 'Ireland',
  'Knitwear', array['Tops','Accessories'], true,
  'Saoirse knits from a converted shed in the Liberties. She learned from her grandmother and has spent eight years refining the same fisherman stitch vocabulary into something entirely her own. Natural fibres only — she won''t work with anything synthetic. Commissions open year-round, though waiting list can stretch to four months.',
  '@saoirse.studio'
),
(
  'marco-de-luca', 'Marco De Luca', '0081', 'Naples, Italy', 'Naples', 'Italy',
  'Tailoring', array['Tops','Bottoms','Outerwear'], false,
  'Fifth-generation Neapolitan. Marco learned to sew before he could read. His tailoring draws on the Campanian tradition of soft construction — no canvas, no padding, just cloth shaped by hand. He keeps a small stock of seasonal pieces; nothing is made to order. Listings only.',
  '@marcodeluca.napoli'
),
(
  'fatou-diallo', 'Fatou Diallo', '0055', 'Paris, France', 'Paris', 'France',
  'Draping', array['Tops','Bottoms'], true,
  'Fatou grew up between Dakar and Paris. Her practice is built around fabric draping — nothing is pinned until the cloth speaks first. She works from a studio in the 18th arrondissement, sourcing deadstock silk and wool from the Sentier district. Studio is small; commissions are selective.',
  '@fatoudiallo.studio'
),
(
  'hyun-ji-seo', 'Hyun-Ji Seo', '0067', 'Seoul, South Korea', 'Seoul', 'South Korea',
  'Accessories', array['Accessories'], false,
  'Hyun-Ji worked in industrial textile production for six years before stepping out to make accessories by hand in a studio in Seongsu-dong. Her bags and card cases are built to last decades — brass hardware, hand-stitched seams, leathers sourced from tanneries in Icheon. Listings only; no custom orders.',
  '@hyunji.objects'
),
(
  'petros-papa', 'Petros Papadimitriou', '0044', 'Athens, Greece', 'Athens', 'Greece',
  'Knitwear', array['Tops','Outerwear'], true,
  'Petros runs a small knitting practice out of Monastiraki, working almost entirely with Greek island wool and natural dyes — madder, weld, and walnut shell. His pieces are slow to make and built to outlast the seasons they''re made in. He accepts commissions for specific colourways.',
  null
)
on conflict (id) do nothing;

-- ── Listings ──────────────────────────────────────────────────
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
('pleated-trouser-twill','dara-osei','Pleated trouser, wool twill','Double-pleated trouser in a mid-weight British wool twill. High rise, straight leg. Made to measure at no extra cost — just include your measurements at checkout.',280,'GBP','£ 280','Bottoms','London',array['/card-4.jpg']),
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
('seamed-jogger-fleece','jihoon-park','Seamed jogger, French fleece','French fleece jogger with exposed exterior seaming. Drawstring waist, no cuff — clean hem. Heavy enough to wear alone in cool weather.',145000,'KRW','₩ 145,000','Bottoms','Seoul',array['/card-1.jpg']),
-- Saoirse Ó Murchú
('fisherman-pullover-aran','saoirse-omurchu','Fisherman pullover, Aran wool','Hand-knit in traditional Aran stitch using undyed wool from a Co. Clare flock. Boxy fit, drop shoulder, ribbed cuffs and hem. Heavy — intended for real weather. One of two available; the other was kept.',380,'EUR','€ 380','Tops','Dublin',array['/card-3.jpg']),
('wool-balaclava-natural','saoirse-omurchu','Balaclava, undyed natural wool','Hand-knit balaclava in a 2-ply undyed wool. Full face opening, snug at the neck. Made in an edition of six; this is the last. One size — stretches to fit.',120,'EUR','€ 120','Accessories','Dublin',array['/card-4.jpg']),
('cable-cardigan-oversized','saoirse-omurchu','Cable-knit cardigan, oversized','Large-gauge cable cardigan in cream undyed wool. Four horn buttons, two deep patch pockets. Oversized deliberately — fits S through L, depending on preference. Knitting time: approximately five weeks.',460,'EUR','€ 460','Outerwear','Dublin',array['/card-1.jpg']),
-- Marco De Luca
('linen-blazer-unlined','marco-de-luca','Unlined blazer, summer linen','Single-button blazer cut in an Italian linen from a mill in Biella. Completely unlined — no canvas, no padding. Soft shoulder, long lapel. Two-button cuffs. Neapolitan spalla camicia construction.',680,'EUR','€ 680','Outerwear','Naples',array['/card-2.jpg']),
('wide-cotton-trouser','marco-de-luca','Wide trouser, cotton gabardine','High-rise, wide-leg trouser in a mid-weight cotton gabardine. Single pleat, side-adjusters, no belt loops. The cut is classic Neapolitan — high waist, long rise, full leg.',285,'EUR','€ 285','Bottoms','Naples',array['/card-4.jpg']),
('silk-pocket-square','marco-de-luca','Pocket square, printed silk','Hand-rolled silk pocket square. The print is adapted from a 19th-century Neapolitan cartouche. Made in a run of twenty — this is one of the last.',65,'EUR','€ 65','Accessories','Naples',array['/card-3.jpg']),
-- Fatou Diallo
('silk-georgette-blouse','fatou-diallo','Draped blouse, silk georgette','Deadstock silk georgette sourced from the Sentier district. One-shoulder drape, no fastening. The weight does the work. Fits S–M. Dry clean only — she ships it clean.',320,'EUR','€ 320','Tops','Paris',array['/card-1.jpg']),
('wool-palazzo-highwaist','fatou-diallo','Palazzo trouser, high-waist wool','High-waist wide-leg trouser in a deadstock French wool crepe. Deep waistband, side zip, no pockets — the silhouette demanded it. Midi length. Limited to two in this fabric.',410,'EUR','€ 410','Bottoms','Paris',array['/card-2.jpg']),
-- Hyun-Ji Seo
('leather-card-sleeve','hyun-ji-seo','Card sleeve, vegetable-tanned leather','Slim card sleeve in natural vegetable-tanned leather from the Icheon tanneries. Four slots, hand-burnished edges, linen thread stitching. Will patinate to a deep honey with use.',85000,'KRW','₩ 85,000','Accessories','Seoul',array['/card-3.jpg']),
('waxed-canvas-crossbody','hyun-ji-seo','Crossbody bag, waxed canvas','Structured crossbody in waxed Korean canvas with full-grain leather trim and solid brass hardware. One main compartment, two exterior pockets. Strap is adjustable and removable.',320000,'KRW','₩ 320,000','Accessories','Seoul',array['/card-4.jpg']),
-- Petros Papadimitriou
('cotton-fisherman-shirt','petros-papa','Fisherman shirt, natural-dye cotton','Oversized shirt in undyed Greek island cotton, dyed with walnut shell. The colour varies batch to batch — this one is a warm taupe. Long sleeves, wide collar, chest pocket. One size.',195,'EUR','€ 195','Tops','Athens',array['/card-1.jpg']),
('indigo-linen-pullover','petros-papa','Hand-loomed pullover, indigo linen','Hand-loomed linen and cotton blend, dyed in natural indigo. Boxy fit, wide neck, dropped sleeve. Heavy enough to wear as an outer layer. The indigo will fade gradually — intentionally.',280,'EUR','€ 280','Tops','Athens',array['/card-2.jpg'])
on conflict (id) do nothing;
