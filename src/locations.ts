const locations = [
  "29. Novembra", //ok
  //   "Ada Ciganlija",
  //   "Altina",
  "Andrićev venac", //ok
  //   "Voždovac (sve podlokacije)",
  "Autokomanda", //ok
  //   "Avala",
  "Banjica", //ok
  //   "Beli potok",
  //   "Braće Jerković",
  //   "Bubanj potok",
  //   "Dušanovac",
  //   "Farmaceutski fakultet",
  //   "Jajinci",
  "Konjarnik", //ok
  "Lekino brdo", //ok
  //   "Marinkova bara",
  //   "Pašino brdo",
  //   "Stepa Stepanović",
  //   "Šumice",
  //   "Torlak",
  //   "Trošarina",
  //   "Veljko Vlahović",
  //   "Voždovac",
  //   "Autoput",
  "Bajlonijeva pijaca", //ok
  "Banija", //ok
  //   "Banovo brdo",
  //   "Barajevo",
  //   "Batajnica",
  //   "Belaci",
  //   "Bele vode",
  "Beograd na vodi", //ok
  //   "Centar (sve podlokacije)", //ok
  "Centar", //ok
  "Beograđanka ( centar )", //ok
  "Centar (uži)", //ok
  "Knez Mihajlova ( centar )", //ok
  "Kneza Miloša ( centar )",
  "Politika ( centar )", //ok
  "Stari Grad", //ok
  "Studentski Trg ( centar )", //ok
  "Terazije ( centar )", //ok
  "Trg Republike ( centar )", //ok
  "Bežanija", //ok
  //   "Bežanijska kosa (sve podlokacije)", //ok
  "Bežanijska kosa", //ok
  "Bežanijska kosa I", //ok
  "Bežanijska kosa II", //ok
  "Bežanijska kosa III", //ok//ok
  //   "Palilula (sve podlokacije)",
  "Bogoslovija", //ok
  "Botanička bašta", //ok
  "Cvijićeva", //ok
  //   "Hadžipopovac",
  //   "Hala Pionir",
  //   "Karaburma",
  //   "Kotež",
  //   "Krnjača",
  //   "Ovča",
  //   "Padinska skela",
  //   "Palilula",
  //   "Palilulska pijaca",
  //   "Poštanska štedionica",
  //   "Profesorska kolonija",
  //   "Rospi ćuprija",
  //   "Tašmajdan",
  //   "Viline vode",
  //   "Višnjica",
  //   "Višnjička banja",
  //   "Borča (Sve podlokacije)",
  //   "Borča I",
  //   "Borča II",
  //   "Borča III",
  //   "Borča IV",
  //   "Borča V",
  "Brodogradilište Beograd",
  //   "Brzi Brod",
  //   "Zvezdara (sve podlokacije)", //ok
  "Zvezdara", //ok
  "Bulbuder", //ok
  "Bulevar Kr. Aleksandra", //ok
  "Cvetanova ćuprija", //ok
  "Cvetkova pijaca", //ok
  "Denkova bašta", //ok
  "Đeram pijaca", //ok
  "Gradska bolnica", //ok
  //   "Kluz",
  "Lion", //ok
  "Lipov lad", //ok
  "Mali mokri lug", //ok
  "Novo groblje", //ok
  "Olimp", //ok
  "Rudo", //ok
  "Severni bulevar", //ok
  "Slavujev venac", //ok
  //   "Smederevski put",
  "Učiteljsko naselje", //ok
  "Veliki mokri lug", //ok
  "Vukov spomenik", //ok
  "Zeleno Brdo", //ok
  "Zira", //ok
  "Zvezdara", //ok
  "Zvezdarska Šuma", //ok
  //   "Cerak vinogradi",
  //   "Cerak",
  //   "Cerski venac",
  //   "Vračar (sve podlokacije)", //ok
  "Vračar", //ok
  //   "Crveni krst",
  "Čubura", //ok
  "Cvetni trg", //ok
  "Gradic Pejton",
  "Južni bulevar", //ok
  "Kalenić pijaca",
  "Neimar",
  "Slavija",
  "Vračar (Centar)", //ok
  "Vračar (Hram)", //ok
  "Čukarica",
  "Čukarička padina",
  //   "Dedinje (sve podlokacije)", //ok"
  "Dedinje", //ok
  "Dedinje (25. maj)", //ok
  "Dedinje (Beli dvor)", //ok
  "Dedinje (RTV Pink)", //ok
  "Dobanovci",
  //   "Dorćol (sve podlokacije)", //ok
  "Dorćol", //ok
  "Donji Dorćol", //ok
  "Dunavski kej",
  "Gornji Dorćol", //ok
  "Strahinjića Bana", //ok
  //   "Filmski grad",
  //   "Galenika",
  //   "Glumčevo brdo",
  //   "Golf naselje",
  //   "Greda",
  //   "Grocka",
  "Gundulićev venac", //ok
  //   "Hipodrom",
  //   "Ibarska magistrala",
  //   "Industrijska zona jug",
  //   "Institut za majku i dete",
  //   "Jabučki rit",
  //   "Jelovac",
  //   "Julino brdo",
  "Kablar", //ok
  "Kalemegdan", //ok
  //   "Kaluđerica",
  //   "Kanarevo brdo",
  //   "Karađorđeva",
  //   "Kijevo",
  "Klinički centar", //ok
  //   "Kneževac",
  "Kopitareva gradina", //ok
  "Kosančićev venac", //ok
  //   "Košutnjak",
  //   "Kumodraž (sve podlokacije)",
  //   "Kumodraž I",
  //   "Kumodraž II",
  // "Labudovo brdo",
  //   "Ledine",
  //   "Leštane",
  //   "Lipovačka šuma",
  //   "Lisičji jarak",
  "Lisičji potok", //ok
  "Mačkov kamen", //ok
  //   "Makiš",
  "Manjež", //ok
  //   "Medaković (sve podlokacije)",
  //   "Medak padina",
  //   "Medaković I",
  //   "Medaković II",
  //   "Medaković III",
  //   "Miljakovac (sve podlokacije)",
  //   "Miljakovac I",
  //   "Miljakovac II",
  //   "Miljakovac III",
  //   "Milka Protic (KP dom)",
  //   "Mirijevo (sve podlokacije)", //ok
  "Mirijevo", //ok
  "Mirijevo I", //ok
  "Mirijevo II", //ok
  "Mirijevo III", //ok
  "Mirijevo IV", //ok
  //   "Novi Beograd (sve podlokacije)",
  "Novi Beograd",
  "Novi Beograd Blok 1 (Fontana)",
  "Novi Beograd Blok 10",
  "Novi Beograd Blok 11 (Hotel Jugoslavija)",
  "Novi Beograd Blok 11a (Opština NBG)",
  "Novi Beograd Blok 11b",
  "Novi Beograd Blok 11c (Stari Merkator)",
  "Novi Beograd Blok 12 (YUBC)",
  "Novi Beograd Blok 13 (Palata federacije)",
  "Novi Beograd Blok 14 (Park Ušće)",
  "Novi Beograd Blok 15 (Park Ušće)",
  "Novi Beograd Blok 16 (Ušće šoping centar)",
  "Novi Beograd Blok 17 (Staro sajmište)",
  "Novi Beograd Blok 19 (Sava Centar)",
  "Novi Beograd Blok 19a",
  "Novi Beograd Blok 2",
  "Novi Beograd Blok 20 (Hotel Hayat)",
  "Novi Beograd Blok 21 (10. Gimnazija)",
  "Novi Beograd Blok 22",
  "Novi Beograd Blok 23",
  "Novi Beograd Blok 24 (Super Vero)",
  "Novi Beograd Blok 25 (Arena)",
  "Novi Beograd Blok 26",
  "Novi Beograd Blok 28 (Potkovica)",
  "Novi Beograd Blok 29",
  "Novi Beograd Blok 3",
  "Novi Beograd Blok 30 (B92)",
  "Novi Beograd Blok 31 (Merkator)",
  "Novi Beograd Blok 32 (Crkva sv. Dimitrija)",
  "Novi Beograd Blok 33 (Genex kula)",
  "Novi Beograd Blok 34 (Studentski grad)",
  "Novi Beograd Blok 35 (SC 11. April)",
  "Novi Beograd Blok 37",
  "Novi Beograd Blok 38 (OŠ Ratko Mitrović)",
  "Novi Beograd Blok 39",
  "Novi Beograd Blok 4 (Politehnička akademija)",
  "Novi Beograd Blok 40",
  "Novi Beograd Blok 41 (Expo centar)",
  "Novi Beograd Blok 41a (GTC)",
  "Novi Beograd Blok 42",
  "Novi Beograd Blok 43 (Buvlja pijaca)",
  "Novi Beograd Blok 44 (Piramida)",
  "Novi Beograd Blok 45 (TC Enjub)",
  "Novi Beograd Blok 49",
  "Novi Beograd Blok 5",
  "Novi Beograd Blok 53 (Kvantaš)",
  "Novi Beograd Blok 58",
  "Novi Beograd Blok 60",
  "Novi Beograd Blok 60 (Airport City)",
  "Novi Beograd Blok 61",
  "Novi Beograd Blok 62",
  "Novi Beograd Blok 63",
  "Novi Beograd Blok 64",
  "Novi Beograd Blok 65",
  "Novi Beograd Blok 66 (Tramvajska štala)",
  "Novi Beograd Blok 66a",
  "Novi Beograd Blok 67 (Belvil)",
  "Novi Beograd Blok 67a",
  "Novi Beograd Blok 68",
  "Novi Beograd Blok 7 (Paviljoni)",
  "Novi Beograd Blok 70 (Kineski TC)",
  "Novi Beograd Blok 70a",
  "Novi Beograd Blok 71",
  "Novi Beograd Blok 72",
  "Novi Beograd Blok 7a (Paviljoni)",
  "Novi Beograd Blok 8 (Paviljoni)",
  "Novi Beograd Blok 8a",
  "Novi Beograd Blok 8a (Paviljoni)",
  "Novi Beograd Blok 9",
  "Novi Beograd Blok 9a (Dom Zdravlja)",
  "Obilićev venac", //ok
  //   "Orlovača",
  //   "Ostružnica",
  "Palata pravde", //ok
  //   "Pančevački most",
  "Partizanov stadion", //ok
  //   "Petlovo brdo",
  "Pionirski park", //ok
  //   "Plavi Horizonti",
  //   "Pregrevica",
  //   "Radiofar",
  //   "Rakovica",
  //   "Resnik",
  //   "Retenzija",
  //   "Reva",
  //   "Rušanj",
  "Sarajevska", //ok
  "Sava mala", //ok
  "Savski trg", //ok
  "Savski venac", //ok
  "Senjak", //ok
  "Skadarlija", //ok
  //   "Skojevsko naselje",
  //   "Sopot",
  //   "Sremčica",
  "Sunčana padina", //ok
  //   "Sunčani breg",
  //   "Surčin",
  //   "Tehnicki fakulteti",
  "Topčider", //ok
  "Topličin venac", //ok
  "Tošin bunar", //ok
  //   "Trešnja",
  //   "Vidikovac",
  //   "Vidikovačka padina",
  //   "Vidikovački venac",
  //   "Vinča",
  //   "Vojvode Vlahovića",
  //   "Žarkovo",
  "Zeleni venac", //ok
  //   "Železnik",
  //   "Zemun (sve podlokacije)",
  //   "Zemun (13. maj)",
  //   "Zemun (Bačka)",
  //   "Zemun (Cara Dušana)",
  //   "Zemun (Centar)",
  //   "Zemun (Ćukovac)",
  //   "Zemun (Donji grad)",
  //   "Zemun (Gardoš)",
  //   "Zemun (Gornji grad)",
  //   "Zemun (Kalvarija)",
  //   "Zemun (Kej)",
  //   "Zemun (Marije Bursać)",
  //   "Zemun (Meandri)",
  //   "Zemun (Nova Galenika)",
  //   "Zemun (Novi Grad)",
  //   "Zemun (Save Kovačevića)",
  //   "Zemun (Sutjeska)",
  //   "Zemun (Teleoptik)",
  //   "Zemun Polje",
  "Zvezdin stadion", //ok
];
