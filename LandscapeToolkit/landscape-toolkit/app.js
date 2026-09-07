
(() => {

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];


  /* =========================================================
     LANGUAGE
     ========================================================= */

  const translations = {
    en: {
      navTools: "Tools",
      navReference: "Reference",
      navAbout: "About",
      mainSite: "← Main site",

      heroTitle: "A small toolkit for",
      heroEm: "site, planting & design.",
      heroText: "Fast calculators and references for landscape architecture studio work — from slope and planting quantities to soil, materials, rainwater and green-area ratios.",
      openToolkit: "Open toolkit ↓",
      quickCalculator: "Quick calculator",
      currentTool: "CURRENT TOOL",
      slopeCalculator: "Slope Calculator",
      plantingShort: "Planting",
      waterShort: "Water",

      toolkitEyebrow: "01 · TOOLKIT",
      chooseTool: "Choose a tool.",
      browserNote: "Each calculator runs directly in the browser. Nothing is uploaded or stored.",

      navSlope: "Slope",
      navSlopeSmall: "rise, run & gradient",
      navPlantQuantity: "Plant Quantity",
      navPlantSmall: "spacing & area",
      navMaterial: "Material Area",
      navMaterialSmall: "waste allowance",
      navSoil: "Soil Volume",
      navSoilSmall: "area × depth",
      navRainwater: "Rainwater",
      navRainSmall: "roof & rainfall",
      navGreen: "Green Ratio",
      navGreenSmall: "site coverage",
      navTree: "Tree Spacing",
      navTreeSmall: "linear planting",
      navParking: "Parking Estimate",
      navParkingSmall: "rough capacity",

      kickerTopography: "TOPOGRAPHY",
      kickerPlantingDesign: "PLANTING DESIGN",
      kickerMaterials: "MATERIALS",
      kickerPlantingConstruction: "PLANTING CONSTRUCTION",
      kickerWater: "WATER MANAGEMENT",
      kickerSitePlanning: "SITE PLANNING",
      kickerLinearPlanting: "LINEAR PLANTING",
      kickerSiteProgram: "SITE PROGRAM",

      plantQuantityCalculator: "Plant Quantity Calculator",
      materialCalculator: "Material Area + Waste",
      soilCalculator: "Soil Volume Calculator",
      rainwaterCalculator: "Rainwater Harvesting",
      greenCalculator: "Green Area Ratio",
      treeCalculator: "Tree Spacing Estimate",
      parkingCalculator: "Parking Capacity Estimate",

      slopeIntro: "Calculate slope percentage, slope ratio and approximate angle from elevation difference and horizontal distance.",
      plantIntro: "Estimate quantities for square-grid or triangular planting. Useful for shrubs, perennials and groundcovers.",
      materialIntro: "Add a waste allowance to paving, decking, stone, mulch or other surface materials.",
      soilIntro: "Estimate soil, compost, substrate or excavation volume.",
      rainIntro: "Estimate harvestable rainwater from a roof or hard surface. 1 mm of rainfall over 1 m² is approximately 1 liter.",
      greenIntro: "Quickly calculate how much of a site is dedicated to green/permeable landscape.",
      treeIntro: "Estimate the number of trees needed along a path, street or planting strip.",
      parkingIntro: "A rough early-stage estimate only. Real layouts must account for geometry, aisles, accessible bays, planting islands, setbacks and local regulations.",

      fieldRise: "Elevation difference / rise",
      fieldRun: "Horizontal distance / run",
      fieldPlantArea: "Planting area",
      fieldPlantSpacing: "Plant spacing",
      fieldPattern: "Pattern",
      squareGrid: "Square grid",
      triangularGrid: "Triangular / staggered",
      fieldMeasuredArea: "Measured area",
      fieldWaste: "Waste allowance",
      fieldArea: "Area",
      fieldDepth: "Depth",
      fieldCompaction: "Compaction / extra allowance",
      fieldCatchment: "Catchment area",
      fieldRainfall: "Rainfall",
      fieldEfficiency: "Collection efficiency",
      fieldSiteArea: "Total site area",
      fieldGreenArea: "Green / permeable area",
      fieldPlantingLength: "Planting length",
      fieldTreeSpacing: "Tree spacing",
      plantBothSides: "Plant both sides",
      fieldParkingArea: "Available parking area",
      fieldParkingAllowance: "Planning allowance per car",
      fieldLength: "Length",
      fieldWidth: "Width",

      resultSlope: "Slope",
      resultAngle: "ANGLE",
      resultRatio: "RATIO",
      resultClass: "CLASS",
      resultEstimatedQuantity: "Estimated quantity",
      resultDensity: "DENSITY",
      resultExtra5: "+5% EXTRA",
      resultOrderQuantity: "Order quantity",
      resultExtraMaterial: "EXTRA MATERIAL",
      resultVolume: "Volume",
      resultBaseVolume: "BASE VOLUME",
      resultHarvestableWater: "Harvestable water",
      resultCubicMeters: "CUBIC METERS",
      resultGreenRatio: "Green ratio",
      resultNonGreen: "NON-GREEN",
      resultEstimatedTrees: "Estimated trees",
      resultActualInterval: "ACTUAL INTERVAL",
      resultApproxCapacity: "Approximate capacity",
      resultAreaPerCar: "AREA / CAR",
      resultArea: "AREA",

      referenceEyebrow: "02 · QUICK REFERENCE",
      studioNotes: "Studio notes.",
      referenceIntro: "Small reminders that are useful while drawing, calculating and preparing presentation boards.",

      comingNext: "COMING NEXT",
      toolkitCanGrow: "This toolkit can grow.",

      aboutEyebrow: "03 · ABOUT",
      aboutTitle: "Built for landscape architecture students.",
      aboutP1: "Landscape Architecture Toolkit is a small collection of practical browser tools for early calculations, studio work and presentation preparation.",
      aboutP2: "It is intentionally lightweight: plain HTML, CSS and JavaScript, so it can be hosted directly on GitHub Pages and expanded over time.",
      returnHome: "Return to Cahil Filozof →",
      footerToolkit: "Landscape Architecture Toolkit",

      quickTool: "QUICK TOOL",
      areaCalculator: "Area Calculator",

      slopeClassFlat: "Flat",
      slopeClassGentle: "Gentle",
      slopeClassModerate: "Moderate",
      slopeClassSteep: "Steep",
      slopeClassVerySteep: "Very steep",
      level: "Level",
      cars: "cars"
    },

    tr: {
      navTools: "Araçlar",
      navReference: "Hızlı Bilgiler",
      navAbout: "Hakkında",
      mainSite: "← Ana site",

      heroTitle: "Peyzaj mimarlığı için",
      heroEm: "alan, bitki ve tasarım araçları.",
      heroText: "Peyzaj mimarlığı stüdyo çalışmaları için hızlı hesaplayıcılar ve referanslar — eğim, bitki adedi, toprak, malzeme, yağmur suyu ve yeşil alan oranından daha fazlası.",
      openToolkit: "Araçları aç ↓",
      quickCalculator: "Hızlı hesap",
      currentTool: "AKTİF ARAÇ",
      slopeCalculator: "Eğim Hesaplayıcı",
      plantingShort: "Bitkilendirme",
      waterShort: "Su",

      toolkitEyebrow: "01 · ARAÇLAR",
      chooseTool: "Bir araç seç.",
      browserNote: "Tüm hesaplamalar doğrudan tarayıcıda çalışır. Hiçbir veri yüklenmez veya saklanmaz.",

      navSlope: "Eğim",
      navSlopeSmall: "kot, mesafe ve eğim",
      navPlantQuantity: "Bitki Adedi",
      navPlantSmall: "aralık ve alan",
      navMaterial: "Malzeme Alanı",
      navMaterialSmall: "fire payı",
      navSoil: "Toprak Hacmi",
      navSoilSmall: "alan × derinlik",
      navRainwater: "Yağmur Suyu",
      navRainSmall: "çatı ve yağış",
      navGreen: "Yeşil Alan Oranı",
      navGreenSmall: "alan kapsamı",
      navTree: "Ağaç Aralığı",
      navTreeSmall: "doğrusal dikim",
      navParking: "Otopark Tahmini",
      navParkingSmall: "yaklaşık kapasite",

      kickerTopography: "TOPOĞRAFYA",
      kickerPlantingDesign: "BİTKİSEL TASARIM",
      kickerMaterials: "MALZEMELER",
      kickerPlantingConstruction: "BİTKİSEL UYGULAMA",
      kickerWater: "SU YÖNETİMİ",
      kickerSitePlanning: "ALAN PLANLAMA",
      kickerLinearPlanting: "DOĞRUSAL BİTKİLENDİRME",
      kickerSiteProgram: "ALAN PROGRAMI",

      plantQuantityCalculator: "Bitki Adedi Hesaplayıcı",
      materialCalculator: "Malzeme Alanı + Fire",
      soilCalculator: "Toprak Hacmi Hesaplayıcı",
      rainwaterCalculator: "Yağmur Suyu Hasadı",
      greenCalculator: "Yeşil Alan Oranı",
      treeCalculator: "Ağaç Aralığı Tahmini",
      parkingCalculator: "Otopark Kapasitesi Tahmini",

      slopeIntro: "Kot farkı ve yatay mesafeden eğim yüzdesini, yaklaşık açıyı ve eğim oranını hesaplar.",
      plantIntro: "Kare veya şaşırtmalı dikim düzenine göre çalı, çok yıllık ve yerörtücü bitki adetlerini tahmin eder.",
      materialIntro: "Kaplama, deck, taş, malç ve benzeri yüzey malzemelerine fire payı ekler.",
      soilIntro: "Toprak, kompost, yetişme ortamı veya kazı hacmini tahmin eder.",
      rainIntro: "Çatı veya sert yüzeylerden toplanabilecek yağmur suyunu tahmin eder. 1 m² yüzeyde 1 mm yağış yaklaşık 1 litredir.",
      greenIntro: "Alan içerisindeki yeşil veya geçirgen yüzey oranını hızlıca hesaplar.",
      treeIntro: "Yol, yaya aksı veya bitki bandı boyunca gerekli yaklaşık ağaç sayısını hesaplar.",
      parkingIntro: "Yalnızca erken tasarım aşaması için yaklaşık bir tahmindir. Gerçek projede geometri, manevra alanları, engelli park yerleri, bitki adaları, çekme mesafeleri ve yerel mevzuat dikkate alınmalıdır.",

      fieldRise: "Kot farkı / yükselti farkı",
      fieldRun: "Yatay mesafe",
      fieldPlantArea: "Bitkilendirme alanı",
      fieldPlantSpacing: "Bitki aralığı",
      fieldPattern: "Dikim düzeni",
      squareGrid: "Kare düzen",
      triangularGrid: "Üçgen / şaşırtmalı düzen",
      fieldMeasuredArea: "Ölçülen alan",
      fieldWaste: "Fire payı",
      fieldArea: "Alan",
      fieldDepth: "Derinlik",
      fieldCompaction: "Sıkışma / ek pay",
      fieldCatchment: "Toplama alanı",
      fieldRainfall: "Yağış",
      fieldEfficiency: "Toplama verimi",
      fieldSiteArea: "Toplam alan",
      fieldGreenArea: "Yeşil / geçirgen alan",
      fieldPlantingLength: "Dikim uzunluğu",
      fieldTreeSpacing: "Ağaç aralığı",
      plantBothSides: "Her iki tarafa dikim",
      fieldParkingArea: "Otopark için kullanılabilir alan",
      fieldParkingAllowance: "Araç başına planlama alanı",
      fieldLength: "Uzunluk",
      fieldWidth: "Genişlik",

      resultSlope: "Eğim",
      resultAngle: "AÇI",
      resultRatio: "ORAN",
      resultClass: "SINIF",
      resultEstimatedQuantity: "Tahmini adet",
      resultDensity: "YOĞUNLUK",
      resultExtra5: "+%5 YEDEK",
      resultOrderQuantity: "Sipariş miktarı",
      resultExtraMaterial: "EK MALZEME",
      resultVolume: "Hacim",
      resultBaseVolume: "TEMEL HACİM",
      resultHarvestableWater: "Toplanabilir su",
      resultCubicMeters: "METREKÜP",
      resultGreenRatio: "Yeşil alan oranı",
      resultNonGreen: "YEŞİL OLMAYAN",
      resultEstimatedTrees: "Tahmini ağaç sayısı",
      resultActualInterval: "GERÇEK ARALIK",
      resultApproxCapacity: "Yaklaşık kapasite",
      resultAreaPerCar: "ARAÇ / ALAN",
      resultArea: "ALAN",

      referenceEyebrow: "02 · HIZLI REFERANS",
      studioNotes: "Stüdyo notları.",
      referenceIntro: "Çizim, hesaplama ve sunum paftası hazırlarken işine yarayabilecek kısa hatırlatmalar.",

      comingNext: "YAKINDA",
      toolkitCanGrow: "Bu araç seti büyüyebilir.",

      aboutEyebrow: "03 · HAKKINDA",
      aboutTitle: "Peyzaj mimarlığı öğrencileri için geliştirildi.",
      aboutP1: "Landscape Architecture Toolkit; ön hesaplamalar, stüdyo çalışmaları ve sunum hazırlıkları için geliştirilmiş küçük ve pratik bir tarayıcı araçları koleksiyonudur.",
      aboutP2: "Bilerek hafif tutuldu: yalnızca HTML, CSS ve JavaScript kullanır. Bu sayede GitHub Pages üzerinde doğrudan yayınlanabilir ve zamanla geliştirilebilir.",
      returnHome: "Cahil Filozof'a dön →",
      footerToolkit: "Peyzaj Mimarlığı Araç Seti",

      quickTool: "HIZLI ARAÇ",
      areaCalculator: "Alan Hesaplayıcı",

      slopeClassFlat: "Düz",
      slopeClassGentle: "Hafif eğimli",
      slopeClassModerate: "Orta eğimli",
      slopeClassSteep: "Dik",
      slopeClassVerySteep: "Çok dik",
      level: "Düz",
      cars: "araç"
    }
  };

  let currentLanguage =
    localStorage.getItem("landscape-toolkit-language") ||
    "en";

  function translatePage() {
    document.documentElement.dataset.language = currentLanguage;
    document.documentElement.lang = currentLanguage;

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const translated = translations[currentLanguage]?.[key];

      if (translated !== undefined) {
        element.textContent = translated;
      }
    });

    const toggle = $("#langToggle");
    if (toggle) {
      toggle.textContent =
        currentLanguage === "en"
          ? "TR"
          : "EN";
    }

    // Recalculate dynamic results whose text also depends on language.
    updateSlope();
    updateParking();
  }

  $("#langToggle")?.addEventListener("click", () => {
    currentLanguage =
      currentLanguage === "en"
        ? "tr"
        : "en";

    localStorage.setItem(
      "landscape-toolkit-language",
      currentLanguage
    );

    translatePage();
  });


  /* =========================================================
     HELPERS
     ========================================================= */

  const number = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };


  const format = (value, digits = 2) =>
    Number(value).toLocaleString(
      undefined,
      {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }
    );


  const formatInteger = value =>
    Math.round(value).toLocaleString();


  /* =========================================================
     TOOL NAVIGATION
     ========================================================= */

  const toolButtons = $$(".tool-nav-item");
  const panels = $$(".tool-panel");


  toolButtons.forEach(button => {

    button.addEventListener("click", () => {

      const tool = button.dataset.tool;

      toolButtons.forEach(item =>
        item.classList.toggle(
          "active",
          item === button
        )
      );

      panels.forEach(panel =>
        panel.classList.toggle(
          "active",
          panel.dataset.panel === tool
        )
      );

    });

  });


  /* =========================================================
     SLOPE
     ========================================================= */

  function updateSlope() {

    const rise = Math.max(
      0,
      number($("#slopeRise").value)
    );

    const run = Math.max(
      0.0001,
      number($("#slopeRun").value, 1)
    );

    const slope = rise / run * 100;

    const angle =
      Math.atan(rise / run) *
      180 /
      Math.PI;

    const ratio =
      rise === 0
        ? Infinity
        : run / rise;

    let classification =
      translations[currentLanguage].slopeClassFlat;

    if (slope > 2) {
      classification =
        translations[currentLanguage].slopeClassGentle;
    }

    if (slope > 5) {
      classification =
        translations[currentLanguage].slopeClassModerate;
    }

    if (slope > 10) {
      classification =
        translations[currentLanguage].slopeClassSteep;
    }

    if (slope > 20) {
      classification =
        translations[currentLanguage].slopeClassVerySteep;
    }

    $("#slopePercent").textContent =
      `${format(slope)}%`;

    $("#slopeAngle").textContent =
      `${format(angle)}°`;

    $("#slopeRatio").textContent =
      Number.isFinite(ratio)
        ? `1 : ${format(ratio)}`
        : translations[currentLanguage].level;

    $("#slopeClass").textContent =
      classification;

  }


  ["#slopeRise", "#slopeRun"].forEach(id =>
    $(id).addEventListener("input", updateSlope)
  );


  /* =========================================================
     PLANT QUANTITY
     ========================================================= */

  function updatePlanting() {

    const area = Math.max(
      0,
      number($("#plantArea").value)
    );

    const spacing = Math.max(
      .001,
      number($("#plantSpacing").value, .5)
    );

    const pattern =
      $("#plantPattern").value;

    let density;

    if (pattern === "triangular") {

      density =
        1 /
        (
          spacing *
          spacing *
          0.8660254
        );

    } else {

      density =
        1 /
        (
          spacing *
          spacing
        );

    }

    const quantity =
      Math.ceil(
        area *
        density
      );

    const extra =
      Math.ceil(
        quantity *
        1.05
      );

    $("#plantQuantity").textContent =
      formatInteger(quantity);

    $("#plantDensity").textContent =
      `${format(density)} / m²`;

    $("#plantExtra").textContent =
      formatInteger(extra);

  }


  [
    "#plantArea",
    "#plantSpacing",
    "#plantPattern"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updatePlanting
    )
  );


  /* =========================================================
     MATERIAL
     ========================================================= */

  function updateMaterial() {

    const area = Math.max(
      0,
      number($("#materialArea").value)
    );

    const waste = Math.max(
      0,
      number($("#materialWaste").value)
    );

    const extra =
      area *
      waste /
      100;

    const total =
      area +
      extra;

    $("#materialTotal").textContent =
      `${format(total)} m²`;

    $("#materialExtra").textContent =
      `${format(extra)} m²`;

  }


  [
    "#materialArea",
    "#materialWaste"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateMaterial
    )
  );


  /* =========================================================
     SOIL
     ========================================================= */

  function updateSoil() {

    const area = Math.max(
      0,
      number($("#soilArea").value)
    );

    const depthCm = Math.max(
      0,
      number($("#soilDepth").value)
    );

    const extraPercent = Math.max(
      0,
      number($("#soilExtra").value)
    );

    const depthM =
      depthCm /
      100;

    const base =
      area *
      depthM;

    const total =
      base *
      (
        1 +
        extraPercent /
        100
      );

    $("#soilBase").textContent =
      `${format(base)} m³`;

    $("#soilVolume").textContent =
      `${format(total)} m³`;

  }


  [
    "#soilArea",
    "#soilDepth",
    "#soilExtra"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateSoil
    )
  );


  /* =========================================================
     RAINWATER
     ========================================================= */

  function updateRainwater() {

    const area = Math.max(
      0,
      number($("#rainArea").value)
    );

    const rainfall = Math.max(
      0,
      number($("#rainMm").value)
    );

    const efficiency = Math.min(
      100,
      Math.max(
        0,
        number($("#rainEfficiency").value)
      )
    ) / 100;

    const liters =
      area *
      rainfall *
      efficiency;

    $("#rainLiters").textContent =
      `${formatInteger(liters)} L`;

    $("#rainM3").textContent =
      `${format(liters / 1000)} m³`;

  }


  [
    "#rainArea",
    "#rainMm",
    "#rainEfficiency"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateRainwater
    )
  );


  /* =========================================================
     GREEN RATIO
     ========================================================= */

  function updateGreen() {

    const site = Math.max(
      .0001,
      number($("#greenSite").value, 1)
    );

    const green = Math.min(
      site,
      Math.max(
        0,
        number($("#greenArea").value)
      )
    );

    const ratio =
      green /
      site *
      100;

    const hard =
      Math.max(
        0,
        site -
        green
      );

    $("#greenRatio").textContent =
      `${format(ratio, 1)}%`;

    $("#greenHard").textContent =
      `${formatInteger(hard)} m²`;

    $("#greenBar").style.width =
      `${Math.min(100, ratio)}%`;

  }


  [
    "#greenSite",
    "#greenArea"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateGreen
    )
  );


  /* =========================================================
     TREE SPACING
     ========================================================= */

  function updateTrees() {

    const length = Math.max(
      0,
      number($("#treeLength").value)
    );

    const spacing = Math.max(
      .001,
      number($("#treeSpacing").value, 6)
    );

    const both =
      $("#treeBothSides").checked;

    const intervals =
      Math.max(
        1,
        Math.floor(
          length /
          spacing
        )
      );

    const countOneSide =
      length === 0
        ? 0
        : intervals + 1;

    const count =
      both
        ? countOneSide * 2
        : countOneSide;

    const actualSpacing =
      intervals > 0
        ? length / intervals
        : 0;

    $("#treeCount").textContent =
      formatInteger(count);

    $("#treeActual").textContent =
      `${format(actualSpacing)} m`;

  }


  [
    "#treeLength",
    "#treeSpacing",
    "#treeBothSides"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateTrees
    )
  );


  /* =========================================================
     PARKING
     ========================================================= */

  function updateParking() {

    const area = Math.max(
      0,
      number($("#parkingArea").value)
    );

    const allowance = Math.max(
      .01,
      number($("#parkingAllowance").value, 28)
    );

    const count =
      Math.floor(
        area /
        allowance
      );

    $("#parkingCount").textContent =
      `${formatInteger(count)} ${translations[currentLanguage].cars}`;

    $("#parkingPerCar").textContent =
      `${format(allowance, 0)} m²`;

  }


  [
    "#parkingArea",
    "#parkingAllowance"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateParking
    )
  );


  /* =========================================================
     QUICK CALCULATOR
     ========================================================= */

  const quickDialog =
    $("#quickCalc");


  $("#openQuickCalc")
    .addEventListener(
      "click",
      () =>
        quickDialog.showModal()
    );


  function updateQuickArea() {

    const length = Math.max(
      0,
      number($("#quickLength").value)
    );

    const width = Math.max(
      0,
      number($("#quickWidth").value)
    );

    $("#quickArea").textContent =
      `${format(length * width)} m²`;

  }


  [
    "#quickLength",
    "#quickWidth"
  ].forEach(id =>
    $(id).addEventListener(
      "input",
      updateQuickArea
    )
  );


  /* =========================================================
     INITIAL VALUES
     ========================================================= */

  updateSlope();
  updatePlanting();
  updateMaterial();
  updateSoil();
  updateRainwater();
  updateGreen();
  updateTrees();
  updateParking();
  updateQuickArea();

  $("#year").textContent =
    new Date().getFullYear();

  translatePage();

})();
