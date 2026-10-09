// Page content ported from the legacy site (src/main.jsx), with the English-only
// descriptions translated into Arabic and French. No new facts.
import type { Lang } from '@/i18n';

type T3 = Record<Lang, string>;

export type IconKey = 'shield' | 'users' | 'handshake' | 'heart' | 'globe' | 'landmark' | 'megaphone' | 'calendar';

export const PROGRAMS: { id: string; icon: IconKey; title: T3; text: T3; category: string }[] = [
  {
    id: 'protection',
    icon: 'shield',
    category: 'Child Protection',
    title: { ar: 'حقوق الطفل والحماية', fr: 'Droits et protection de l’enfant', en: 'Child rights & protection' },
    text: {
      ar: 'مناصرة وتوعية، أيام دراسية قانونية، ترسيخ ثقافة الوقاية، وتنسيق مخصّص لكرامة الأطفال وسلامتهم.',
      fr: 'Plaidoyer, sensibilisation, journées d’étude juridiques, culture de la prévention et coordination au service de la dignité et de la sécurité des enfants.',
      en: 'Advocacy, awareness, legal seminars, a culture of prevention and coordination dedicated to children’s dignity and safety.',
    },
  },
  {
    id: 'inclusion',
    icon: 'users',
    category: 'Reintegration',
    title: { ar: 'إدماج الشباب والفئات الهشة', fr: 'Insertion des jeunes et publics vulnérables', en: 'Youth & vulnerable-group inclusion' },
    text: {
      ar: 'مرافقة نحو الإدماج الاجتماعي والمهني، جسور نحو سوق العمل، وملتقيات مع المؤسسات.',
      fr: 'Accompagnement vers l’insertion sociale et professionnelle, passerelles vers le marché du travail et forums institutionnels.',
      en: 'Support toward social and professional inclusion, bridges to the labour market and institutional forums.',
    },
  },
  {
    id: 'solidarity',
    icon: 'heart',
    category: 'Solidarity',
    title: { ar: 'التضامن المجتمعي', fr: 'Solidarité communautaire', en: 'Community solidarity' },
    text: {
      ar: 'دعم الأيتام والفئات الهشة، الاستجابة للأزمات، وتعبئة المتطوعين حول عمل ميداني ملموس.',
      fr: 'Soutien aux orphelins et aux publics vulnérables, réponse aux crises et mobilisation de bénévoles autour d’actions concrètes.',
      en: 'Support for orphans and vulnerable groups, crisis response and mobilising volunteers around practical action.',
    },
  },
  {
    id: 'partnership',
    icon: 'handshake',
    category: 'Partnerships',
    title: { ar: 'الشراكة والإعلام المدني', fr: 'Partenariat et communication civique', en: 'Civic partnership & media' },
    text: {
      ar: 'جسر مفتوح مع الجامعات والمنتخبين ومصالح الولاية والجمعيات عبر تواصل شفاف.',
      fr: 'Une passerelle ouverte avec les universités, les élus, les services de la wilaya et les associations, par une communication transparente.',
      en: 'An open bridge with universities, elected officials, wilaya services and associations through transparent communication.',
    },
  },
];

export const GOALS: { icon: IconKey; title: T3; text: T3 }[] = [
  {
    icon: 'shield',
    title: { ar: 'الدفاع عن حقوق الطفل', fr: 'Défendre les droits de l’enfant', en: 'Defend children’s rights' },
    text: {
      ar: 'ترقية حقوق الطفل عبر التوعية والمناصرة والتعبئة المدنية.',
      fr: 'Promouvoir les droits de l’enfant par la sensibilisation, le plaidoyer et la mobilisation citoyenne.',
      en: 'Promote children’s rights through awareness, advocacy and civic mobilisation.',
    },
  },
  {
    icon: 'users',
    title: { ar: 'مرافقة الشباب', fr: 'Accompagner les jeunes', en: 'Support young people' },
    text: {
      ar: 'مرافقة الشباب والفئات الهشة بالتوجيه وفتح مسارات إدماج حقيقية.',
      fr: 'Accompagner les jeunes et les publics vulnérables par l’orientation et de vrais parcours d’insertion.',
      en: 'Support young people and vulnerable groups with guidance and real pathways to inclusion.',
    },
  },
  {
    icon: 'handshake',
    title: { ar: 'تعزيز الإدماج الاجتماعي', fr: 'Renforcer l’insertion sociale', en: 'Strengthen social inclusion' },
    text: {
      ar: 'المساهمة في مبادرات تربط المجتمع المدني بالمؤسسات والفاعلين الاقتصاديين.',
      fr: 'Contribuer aux initiatives qui relient la société civile, les institutions et les acteurs économiques.',
      en: 'Contribute to initiatives that connect civil society, institutions and economic actors.',
    },
  },
  {
    icon: 'heart',
    title: { ar: 'ترسيخ التضامن', fr: 'Faire vivre la solidarité', en: 'Anchor solidarity' },
    text: {
      ar: 'تحويل الإنصاف إلى تضامن عملي عبر العمل الميداني، الاستجابة للأزمات والدعم الاجتماعي.',
      fr: 'Traduire l’équité en solidarité concrète : action de terrain, réponse aux crises et soutien social.',
      en: 'Turn equity into practical solidarity through fieldwork, crisis response and social support.',
    },
  },
  {
    icon: 'globe',
    title: { ar: 'بناء الشراكات', fr: 'Consolider les partenariats', en: 'Build partnerships' },
    text: {
      ar: 'العمل مع الهيئة الوطنية لحماية وترقية الطفولة، مديرية الشباب والرياضة، الجامعات، سلطات الولاية والشركاء المدنيين.',
      fr: 'Travailler avec l’ONPPE, la DJS, les universités, les autorités de la wilaya et les partenaires civils.',
      en: 'Work with ONPPE, the DJS, universities, the wilaya authorities and civic partners.',
    },
  },
];

/**
 * Milestones from the legacy "achievements" page. `post` links the Facebook post the
 * achievement is based on; `photo` is a file in src/assets/photos.
 * (ach1/ach2/ach6 used to point at two photos that never existed; they now use
 * photos from their source posts.)
 */
export const ACHIEVEMENTS: { id: string; date: string; icon: IconKey; photo?: string; post?: string; category?: string; title: T3; text: T3 }[] = [
  {
    id: 'ach1',
    date: '2026-07-12',
    icon: 'landmark',
    photo: '1029462606144145.jpg',
    post: '1029463656144040',
    title: { ar: 'مشاركة وطنية في ملتقى إعادة الإدماج الاجتماعي', fr: 'Participation au forum national sur la réinsertion sociale', en: 'National forum on social reintegration' },
    text: {
      ar: 'مشاركة الجمعية كشريك في الملتقى الوطني الأول حول إعادة الإدماج الاجتماعي للمحبوسين في سوق العمل بجامعة محمد لمين دباغين سطيف.',
      fr: 'L’association, partenaire du premier forum national sur la réinsertion socioprofessionnelle des détenus, à l’Université Mohamed Lamine Debaghine Sétif 2.',
      en: 'The association took part as a partner in the first national forum on the labour-market reintegration of detainees, at Mohamed Lamine Debaghine University, Sétif 2.',
    },
  },
  {
    id: 'ach2',
    date: '2026-07-09',
    icon: 'megaphone',
    photo: '1026462569777482.jpg',
    post: '1026462589777480',
    title: { ar: 'حضور إعلامي لمشاريع جمعوية ممولة 2026', fr: 'Lancement des projets associatifs financés 2026', en: 'Launch of 2026 funded association projects' },
    text: {
      ar: 'مشاركة في لقاء إعلامي مع الحركة الجمعوية شريكة القطاع بسطيف ضمن برنامج إطلاق المشاريع الجمعوية الممولة من وزارة الشباب.',
      fr: 'Participation à une rencontre d’information avec les associations partenaires du secteur à Sétif, dans le cadre du lancement des projets associatifs financés par le ministère de la Jeunesse.',
      en: 'Took part in a media meeting with the sector’s partner associations in Sétif, as part of the launch of association projects funded by the Ministry of Youth.',
    },
  },
  {
    id: 'ach3',
    date: '2026-07-08',
    icon: 'handshake',
    photo: '1029463466144059.jpg',
    title: { ar: 'تواصل مع السلطات الولائية والجامعة', fr: 'Dialogue avec les autorités de la wilaya et l’université', en: 'Working with the wilaya and the university' },
    text: {
      ar: 'التقاء وشراكات مع والي سطيف، مديرية الشباب والرياضة، ديوان مؤسسات الشباب، والجامعة لخدمة ملفات الطفولة والشباب.',
      fr: 'Rencontres et partenariats avec le wali de Sétif, la DJS, l’ODEJ et l’université au service des dossiers de l’enfance et de la jeunesse.',
      en: 'Meetings and partnerships with the Wali of Sétif, the DJS, the ODEJ and the university on childhood and youth issues.',
    },
  },
  {
    id: 'ach4',
    date: '2014-06-01',
    icon: 'calendar',
    title: { ar: 'تأسيس الجمعية — جوان 2014', fr: 'Création de l’association — juin 2014', en: 'Founded in June 2014' },
    text: {
      ar: 'تأسست الجمعية في جوان 2014 كفاعل مدني متخصص في الدفاع عن حقوق الطفل، مرافقة الشباب، والتضامن المجتمعي.',
      fr: 'L’association a été créée en juin 2014, acteur civil dédié aux droits de l’enfant, à l’accompagnement des jeunes et à la solidarité.',
      en: 'The association was founded in June 2014 as a civic actor dedicated to children’s rights, supporting young people and community solidarity.',
    },
  },
  {
    id: 'ach5',
    date: '2026-07-06',
    icon: 'heart',
    category: 'Solidarity', // its posts are condolences, so no photo is shown
    title: { ar: 'دعم الفئات الهشة والاستجابة التضامنية', fr: 'Soutien aux publics vulnérables et solidarité', en: 'Standing with vulnerable groups' },
    text: {
      ar: 'تفاعل مباشر مع قضايا الأيتام، الأزمات، والمواساة الشعبية عبر منشورات وتنسيق ميداني مع الفاعلين المحليين.',
      fr: 'Engagement direct auprès des orphelins, dans les crises et les moments de deuil, avec une coordination de terrain avec les acteurs locaux.',
      en: 'Direct engagement with orphans, crises and community mourning, through outreach and field coordination with local actors.',
    },
  },
  {
    id: 'ach6',
    date: '2026-07-19',
    icon: 'users',
    photo: '1034715132285559.jpg',
    post: '1034715162285556',
    title: { ar: 'حضور مدني في النقاش العمومي', fr: 'Une voix civique dans le débat public', en: 'A civic voice in public debate' },
    text: {
      ar: 'الدفاع عن شراكة حقيقية بين نواب الشعب والمنظمات الفاعلة للمجتمع المدني لخدمة مواطني الولاية.',
      fr: 'Plaider pour un vrai partenariat entre les députés et les organisations de la société civile au service des citoyens de la wilaya.',
      en: 'Advocating a real partnership between members of parliament and civil-society organisations to serve the province’s citizens.',
    },
  },
];
