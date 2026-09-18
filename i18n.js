/* Text bindings preserve the semantic HTML and work without a rendering framework. */
(() => {
  const pairs = [
    ['Seçilmiş projelere geç', 'Skip to selected work'], ['Portfolyo', 'Portfolio'], ['Özgeçmiş', 'CV'], ['Hakkımda', 'About'], ['İletişim', 'Contact'],
    ['PEYZAJ MİMARLIĞI', 'LANDSCAPE ARCHITECTURE'], ['MEKÂNLAR VE OLASILIKLAR ÜZERİNE BİR PORTFOLYO', 'A PORTFOLIO OF PLACES & POSSIBILITIES'],
    ['01 / YAŞAYAN TOPOGRAFYA', '01 / LIVING TOPOGRAPHY'], ['Ekoloji. İnsan. Mekân.', 'Ecology. People. Place.'], ['Etkileşimli peyzaj etüdü', 'Interactive landscape study'],
    ['01 Arazi', '01 Terrain'], ['02 Bitkilendirme', '02 Planting'], ['03 Su', '03 Water'], ['Peyzaj katmanları', 'Landscape layers'],
    ['Seçilmiş projeleri keşfet', 'Explore selected work'], ['Doğayla birlikte düşünen,', 'Spaces that think with nature,'], ['yaşamla şekillenen mekânlar.', 'shaped by everyday life.'],
    ['KEŞFETMEK İÇİN KAYDIR ↓', 'SCROLL TO DISCOVER ↓'], ['TOPRAK · YAŞAM · OLASILIK ·', 'LAND · LIFE · POSSIBILITY ·'],
    ['YAKLAŞIM', 'THE APPROACH'], ['Doğa ile', 'Between nature'], ['gündelik yaşam', 'everyday life.'], ['arasında.', 'and'],
    ['Peyzajı bir arka plan olarak değil, yaşamın bir parçası olarak ele alıyorum. Kamusal alan, bitkisel tasarım ve ekolojik düşünce üzerine seçilmiş çalışmalar.', 'I approach landscape as an essential part of life. Selected explorations of public space, planting design and ecological thinking.'],
    ['Seçilmiş', 'Selected'], ['peyzajlar.', 'landscapes.'], ['Portfolyo PDF indir ↓', 'Download Portfolio PDF ↓'],
    ['Peyzaj Tasarımı', 'Landscape Design'], ['Konut Peyzajı', 'Residential Landscape'], ['Toplu Konut', 'Collective Housing'], ['Kamusal Alan', 'Public Space'], ['Teknik Tasarım', 'Technical Design'], ['Kentsel Peyzaj Planlama', 'Urban Landscape Planning'], ['Yarışma', 'Competition'],
    ['Üniversite Kantin Bahçesi Projesi', 'University Canteen Garden'], ['Tek Konut - Rektörün Evi', 'A Garden for the Rector’s Residence'], ['Toplu Konut Projesi - Bursa / Nilüfer', 'Collective Housing — Bursa / Nilüfer'], ['Kent Meydanı Projesi - Bursa / Özlüce', 'Urban Square — Bursa / Özlüce'], ['Çocuk Oyun Alanı Sınır Elemanı', 'Playground Boundary Structure'], ['Kentsel Peyzaj Planlama - Bursa / Osmangazi - Nilüfer', 'Urban Landscape Planning — Osmangazi / Nilüfer'], ['“Bir Can Daha” - Kedi Evi Tasarım Yarışması', '“One More Life” — Cat House Competition'],
    ['Bursa Uludağ Üniversitesi Ziraat Fakültesi kantin çevresinde, ateş böceği kanadı fikrinden gelişen sosyal ve rekreatif açık alan tasarımı.', 'A social and recreational landscape around the Faculty of Agriculture canteen at Bursa Uludağ University, inspired by the wing of a firefly.'],
    ['Kullanıcı profiline göre üretim, dinlenme, hobi ve özel kullanım alanlarının birlikte kurgulandığı konut bahçesi tasarımı.', 'A residential garden that brings productive planting, relaxation, hobbies and private outdoor spaces together around the needs of its residents.'],
    ['Çocuk oyun alanları, yüzme havuzu, açık hava sineması, sosyal alanlar ve aktif yaşam bileşenlerini bir araya getiren peyzaj projesi.', 'A shared landscape combining children’s play, a swimming pool, open-air cinema, social spaces and opportunities for active everyday living.'],
    ['Kullanıcı etkileşimi, kamusal yaşam ve deneyimsel mekân kurgusuna odaklanan kent meydanı tasarımı.', 'An urban square exploring social interaction, public life and the experience of moving through shared space.'],
    ['Oturma, çizim, tırmanma, ışıklı oyun duvarı, yeşil çatı ve güneş panelini tek bir etkileşimli sınır elemanında birleştiren konstrüksiyon çalışması.', 'A construction study integrating seating, drawing, climbing, an illuminated play wall, a green roof and a solar panel into one interactive boundary.'],
    ['Doğal ve kültürel veriler, GZFT değerlendirmesi ve yeşil altyapı stratejileri üzerinden geliştirilen 15 mahalle ölçekli planlama çalışması.', 'A landscape planning study spanning 15 neighbourhoods, developed through natural and cultural data, SWOT analysis and green infrastructure strategies.'],
    ['Sokak kedilerinin barınma, beslenme, tırmanma, oyun ve korunma ihtiyaçları için geliştirilen çok işlevli yarışma projesi.', 'A multifunctional competition proposal providing street cats with shelter, feeding areas, climbing, play and protection.'],
    ['Üniversite kantin bahçesi peyzaj projesi genel görünüşü', 'Overview of the university canteen garden design'], ['Tek konut peyzaj projesi genel görünüşü', 'Overview of the residential garden design'], ['Toplu konut peyzaj projesi kuşbakışı görünüşü', 'Aerial view of the collective housing landscape'], ['Kent meydanı peyzaj projesi kuşbakışı görünüşü', 'Aerial view of the urban square design'], ['Çocuk oyun alanı sınır elemanı tasarımı', 'Design of the interactive playground boundary'], ['Kentsel peyzaj planlama çalışma alanı üç boyutlu görünüşü', 'Three-dimensional view of the landscape planning study area'], ['Bir Can Daha kedi evi yarışma projesi', 'One More Life cat house competition proposal'],
    ['Özgeçmiş', 'Curriculum Vitae'], ['Özgeçmiş PDF indir ↓', 'Download CV PDF ↓'], ['Peyzaj Mimarlığı Öğrencisi', 'Landscape Architecture Student'],
    ['Eğitim', 'Education'], ['2018 - 2022', '2018 - 2022'], ['2023 - Şimdi', '2023 – Present'], ['Peyzaj Mimarlığı / Lisans 3. Sınıf', 'Landscape Architecture / Third-year undergraduate'],
    ['Dil', 'Language'], ['İngilizce - A2 Seviye', 'English — A2 level'], ['Beceriler', 'Skills'], ['Takım çalışması', 'Teamwork'], ['Liderlik', 'Leadership'], ['Tasarım', 'Design'], ['Kolaj', 'Collage'], ['Profil', 'Profile'],
    ['Üniversitemdeki yaklaşık 1000 kişilik Ziraat Topluluğu yönetim ekibinde uzun süre görev aldım, peyzaj bölümünü temsil ettim ve birçok seminer, kariyer zirvesi ve sosyal etkinliğin organizasyonunda yer aldım. Son dönemde Başkan Yardımcılığı yaparak ekip yönetimi becerilerimi geliştirdim. Kedi Evi Tasarım Yarışması’nda ekibimle birincilik kazandım. Peyzaj tasarımı, ekip çalışması ve etkinlik organizasyonu alanlarında aktif ve üretken bir öğrenciyim.', 'I served on the management team of my university’s Agriculture Society, a community of around 1,000 members, representing landscape architecture and organising seminars, career events and social activities. More recently, I developed my team leadership skills as Vice President. My team won first place in the Cat House Design Competition. I am an active student with interests in landscape design, collaboration and event organisation.'],
    ['Deneyim', 'Experience'], ['İş Deneyimlerim', 'My experience'], ['Makale Yazarlığı', 'Article Writer'], ['Stajyer', 'Intern'],
    ['Yat tasarımı, denizcilik kültürü ve sektörel trendler üzerine düzenli makaleler hazırladım.', 'Wrote regular articles on yacht design, maritime culture and industry trends.'], ['Araştırma, içerik geliştirme ve editoryal süreçlerde aktif rol aldım.', 'Contributed to research, content development and editorial work.'],
    ['Peyzaj proje çizimi, bitki seçimi ve fidanlık alış süreçlerine destek oldum.', 'Assisted with landscape drawings, plant selection and nursery purchasing.'], ['Photoshop üzerinden görsel düzenleme ve sunum hazırlığı yaptım.', 'Prepared visual edits and presentations using Photoshop.'],
    ['Fidanlıkta bitki üretimi, bakım, sulama ve tür tanıma süreçlerine aktif olarak katıldım.', 'Participated in plant production, maintenance, irrigation and species identification at the nursery.'], ['Bitki seçimi, sevkiyat hazırlığı ve saha düzenlemelerine destek verdim.', 'Supported plant selection, shipment preparation and site organisation.'],
    ['Hakkımda', 'About Me'], ['Peyzaj mimarlığı öğrencisiyim. Tasarım, kamusal alanlar, bitkisel tasarım, çevresel düşünce ve görsel anlatım üzerine çalışıyorum. Bu site projelerimi, özgeçmişimi ve gelişen dijital üretimlerimi tek bir yerde topluyor.', 'I am a landscape architecture student exploring design, public spaces, planting, environmental thinking and visual storytelling. This portfolio brings together my projects, experience and evolving creative practice.'],
    ['Birlikte yeni mekânlar tasarlayalım.', 'Let’s create something.'], ['Projeler, staj fırsatları, yaratıcı iş birlikleri veya profesyonel iletişim için bana ulaşabilirsin.', 'Get in touch about projects, internship opportunities, creative collaborations or professional enquiries.'], ['E-posta gönder ↗', 'Send an Email ↗'], ['Başa dön ↑', 'Back to Top ↑'],
    ['© 2026 Sevde Nur Fidan · Peyzaj Mimarlığı', '© 2026 Sevde Nur Fidan · Landscape Architecture'], ['Portfolyonun tamamını incele ↗', 'Explore the full portfolio ↗'], ['← Önceki proje', '← Previous project'], ['Sonraki proje →', 'Next project →'], ['Kapat ×', 'Close ×'], ['Projeyi kapat', 'Close project'], ['Ana navigasyon', 'Main navigation'], ['Tasarım yaklaşımı', 'Design approach'], ['Hareketi durdur', 'Pause motion'], ['Hareketi başlat', 'Resume motion']
  ];
  const normal = text => text.replace(/\s+/g, ' ').trim();
  const lookup = new Map();
  pairs.forEach(pair => pair.forEach(text => { if (!lookup.has(normal(text))) lookup.set(normal(text), pair); }));
  const bindings = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script, style, #language-toggle')) continue;
    const pair = lookup.get(normal(node.nodeValue));
    if (pair) bindings.push({ node, pair, prefix: node.nodeValue.match(/^\s*/)[0], suffix: node.nodeValue.match(/\s*$/)[0] });
  }
  const attributes = [];
  document.querySelectorAll('[alt], [aria-label]').forEach(element => ['alt', 'aria-label'].forEach(attribute => {
    const pair = lookup.get(normal(element.getAttribute(attribute) || ''));
    if (pair) attributes.push({ element, attribute, pair });
  }));
  let language = 'tr';
  try { language = localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'tr'; } catch {}
  const button = document.querySelector('#language-toggle');
  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'tr';
    const index = language === 'tr' ? 0 : 1;
    bindings.forEach(binding => { binding.node.nodeValue = binding.prefix + binding.pair[index] + binding.suffix; });
    attributes.forEach(binding => binding.element.setAttribute(binding.attribute, binding.pair[index]));
    // This sentence has a different word order in Turkish.
    const intro = document.querySelector('.intro-strip > p');
    intro.innerHTML = language === 'tr' ? 'Doğa ile<br><em>gündelik yaşam</em> arasında.' : 'Between nature<br>and <em>everyday life.</em>';
    document.documentElement.lang = language;
    document.title = `Sevde Nur Fidan | ${language === 'tr' ? 'Peyzaj Mimarlığı' : 'Landscape Architecture'}`;
    document.querySelector('meta[name="description"]').content = language === 'tr' ? 'Sevde Nur Fidan — Peyzaj mimarlığı, kamusal alan ve bitkisel tasarım portfolyosu.' : 'Sevde Nur Fidan — A portfolio of landscape architecture, public space and planting design.';
    button.innerHTML = `${language === 'tr' ? 'EN' : 'TR'} <span aria-hidden="true">↗</span>`;
    button.setAttribute('aria-label', language === 'tr' ? 'Switch to English' : 'Türkçeye geç');
    button.lang = language === 'tr' ? 'en' : 'tr';
    try { localStorage.setItem('portfolio-language', language); } catch {}
    document.dispatchEvent(new CustomEvent('languagechange'));
  }
  window.portfolioLanguage = { get current() { return language; }, text(tr, en) { return language === 'tr' ? tr : en; }, set: setLanguage };
  button.addEventListener('click', () => setLanguage(language === 'tr' ? 'en' : 'tr'));
  setLanguage(language);
})();
