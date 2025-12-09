import { IDocumentTemplate } from '@document/interfaces/document';
import { PrismaClient, BlockType } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_MAN_IMAGE = 'document/default_man_picture.jpg';
const DEFAULT_WOMAN_IMAGE = 'document/default_woman_picture.jpg';

export const CV_TEMPLATES: IDocumentTemplate[] = [
  {
    id: '1001',
    title: 'Կլասիկ պրոֆեսիոնալ',
    backgroundColor: '#FFFFFF',
    isEditMode: false,
    previewPath: 'document/template_picture_1.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 1101,
        top: 80,
        left: 90,
        width: 450,
        height: 90,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն Ազգանուն',
        content: 'Արմեն Պետրոսյան',
        fontSize: 42,
        fontWeight: '700',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 1102,
        top: 170,
        left: 90,
        width: 400,
        height: 120,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտային տվյալներ',
        content: `<strong>Տարիք:</strong> 28 տարեկան<br/>
  <strong>Հեռախոս:</strong> +374 91 123 456<br/>
  <strong>Էլ. փոստ:</strong> armen.petrosyan@example.am`,
        fontSize: 14,
        fontWeight: '400',
        color: '#475569',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 1103,
        top: 310,
        left: 90,
        width: 600,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'description',
        defaultContent: 'Մասնագիտական նկարագրություն',
        content:
          'Տվյալագիտության մասնագետ՝ 6 տարվա փորձով։ Սիրում եմ բարդ խնդիրները բաժանել պարզ քայլերի և կառուցել տվյալահենք լուծումներ, որոնք օգնում են բիզնեսին աճել։',
        fontSize: 16,
        fontWeight: '400',
        color: '#334155',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 1104,
        top: 450,
        left: 90,
        width: 600,
        height: 280,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Աշխատանքային փորձ',
        content: `<strong>Տվյալագիտության թիմի ղեկավար</strong><br/>
  <em>DataForge · 2021 — ներկայում</em><br/>
  - Ղեկավարել եմ 8 մասնագետից բաղկացած թիմը՝ բանկային ոլորտի նախագծերում<br/>
  - Տեղականացրել եմ ML մոդելներ, որոնք ավելացրել են եկամուտը 17%-ով<br/><br/>
  <strong>Տվյալագիտության վերլուծաբան</strong><br/>
  <em>ArmAnalytics · 2018 — 2021</em><br/>
  - Ստեղծել եմ ավտոմատացված հաշվետվություններ Power BI-ով<br/>
  - Իրականացրել եմ օգտագործող-կլասթերացում՝ CRM արշավների օպտիմալացման համար`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 1105,
        top: 720,
        left: 90,
        width: 600,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Կիրառական մաթեմատիկա և ինֆորմատիկա</strong><br/>
  Երևանի Պետական Համալսարան<br/>
  2013 — 2017<br/>
  <em>Բակալավրի աստիճան</em><br/><br/>
  <strong>Հմտություններ</strong><br/>
  Python · SQL · TensorFlow · Docker · Agile`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 1201,
        top: 80,
        left: 530,
        width: 160,
        height: 160,
        rotation: 0,
        zIndex: 2,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 1301,
        top: 280,
        left: 90,
        width: 600,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#E2E8F0',
        borderColor: '#E2E8F0',
        isEditMode: false,
      },
      {
        id: 1302,
        top: 420,
        left: 90,
        width: 600,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#E2E8F0',
        borderColor: '#E2E8F0',
        isEditMode: false,
      },
    ],
  },
  {
    id: '2001',
    title: 'Ժամանակակից գունային',
    backgroundColor: '#0F172A',
    isEditMode: false,
    previewPath: 'document/template_picture_2.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 2101,
        top: 80,
        left: 80,
        width: 400,
        height: 90,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն Ազգանուն',
        content: 'Մարիա Ավագյան',
        fontSize: 44,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 2102,
        top: 220,
        left: 80,
        width: 380,
        height: 100,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 26 տարեկան<br/>
  <strong>Հեռախոս:</strong> +374 99 456 789<br/>
  <strong>Էլ. փոստ:</strong> maria.avagyan@example.am`,
        fontSize: 14,
        fontWeight: '400',
        color: '#CBD5E1',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 2103,
        top: 350,
        left: 80,
        width: 580,
        height: 140,
        rotation: 0,
        zIndex: 1,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'UI/UX դիզայներ՝ կենտրոնացած բրենդավորված թվային փորձառությունների վրա։ Հավատում եմ, որ լավ դիզայնը պետք է լինի ինչպես էսթետիկ, այնպես էլ խիստ օգտակար։',
        fontSize: 16,
        fontWeight: '400',
        color: '#E2E8F0',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 2104,
        top: 530,
        left: 80,
        width: 580,
        height: 280,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>UI/UX դիզայներ</strong><br/>
  <em>Creative Studio · 2020 — ներկայում</em><br/>
  - Վերակառուցված UI Armenia Travel-ի համար, որը բարձրացրել է կանխավճարները 30%-ով<br/>
  - Ստեղծել եմ դիզայն-սիստեմ՝ հիվանդանոցային SaaS-ի համար<br/><br/>
  <strong>Ջունիոր դիզայներ</strong><br/>
  <em>WebSolutions · 2018 — 2020</em><br/>
  - Մշակել եմ 15+ վեբ-կայքեր և մոբայլ հավելվածներ`,
        fontSize: 15,
        fontWeight: '400',
        color: '#E2E8F0',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 2105,
        top: 850,
        left: 80,
        width: 580,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Գրաֆիկական դիզայն</strong><br/>
  ԵՊՀ Արուեստների ֆակուլտետ<br/>
  2014 — 2018<br/><br/>
  <strong>Հմտություններ</strong><br/>
  Figma · Adobe XD · Sketch · Prototyping · User Research`,
        fontSize: 15,
        fontWeight: '400',
        color: '#E2E8F0',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 2201,
        top: 80,
        left: 540,
        width: 170,
        height: 170,
        rotation: 0,
        zIndex: 2,
        path: DEFAULT_WOMAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 2301,
        top: 90,
        left: 60,
        width: 8,
        height: 960,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        isEditMode: false,
      },
      {
        id: 2302,
        top: 490,
        left: 60,
        width: 8,
        height: 250,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#22D3EE',
        borderColor: '#22D3EE',
        isEditMode: false,
      },
    ],
  },
  {
    id: '3001',
    title: 'Երկկողմանի պրոֆեսիոնալ',
    backgroundColor: '#F9F5F0',
    isEditMode: false,
    previewPath: 'document/template_picture_3.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 3101,
        top: 250,
        left: 35,
        width: 290,
        height: 100,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Արթուր Կարապետյան',
        fontSize: 32,
        fontWeight: '700',
        color: '#0F172A',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 3102,
        top: 370,
        left: 35,
        width: 290,
        height: 140,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 32 տարեկան<br/>
  <strong>Հեռախոս:</strong> +374 93 111 222<br/>
  <strong>Էլ. փոստ:</strong> artur.karapetyan@example.am<br/>
  <strong>LinkedIn:</strong> linkedin.com/in/artur`,
        fontSize: 13,
        fontWeight: '400',
        color: '#1F2937',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 3103,
        top: 480,
        left: 35,
        width: 290,
        height: 200,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Հմտություններ',
        content: `<strong>Տեխնիկական</strong><br/>
  Python · JavaScript<br/>
  React · Node.js<br/>
  PostgreSQL · MongoDB<br/><br/>
  <strong>Մեթոդոլոգիաներ</strong><br/>
  Agile · Scrum<br/>
  DevOps · CI/CD`,
        fontSize: 14,
        fontWeight: '400',
        color: '#1F2937',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 3104,
        top: 80,
        left: 380,
        width: 340,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Մենեջեր տվյալների ոլորտում՝ խորը տեխնիկական գիտելիքներով և թիմեր կառուցելու փորձով։ Էֆեկտիվ հաղորդակցումը և առաքումը՝ իմ գլխավոր սկզբունքներն են։',
        fontSize: 16,
        fontWeight: '400',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 3105,
        top: 290,
        left: 380,
        width: 340,
        height: 320,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>ՏՏ Ծրագրերի մենեջեր</strong><br/>
  <em>Nimbus Tech · 2019 — ներկայում</em><br/>
  - Վարել եմ բազմաբաժին նախագծեր՝ մինչև 12 մասնագետով թիմերով<br/>
  - Ստեղծել եմ KPI համակարգ, որը կրճատել է սխալները 30%-ով<br/><br/>
  <strong>Scrum Master</strong><br/>
  <em>FastWave · 2015 — 2019</em><br/>
  - Կազմակերպել եմ ամենօրյա ստենդ-ափեր և սպրինթ պլանավորում<br/>
  - Բարելավել եմ թիմի արտադրողականությունը 40%-ով`,
        fontSize: 15,
        fontWeight: '400',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 3106,
        top: 600,
        left: 380,
        width: 340,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Տեղեկատվական Տեխնոլոգիաներ</strong><br/>
  Երևանի Պետական Համալսարան<br/>
  2011 — 2015<br/>
  <em>Բակալավրի աստիճան</em>`,
        fontSize: 15,
        fontWeight: '400',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 3201,
        top: 60,
        left: 40,
        width: 260,
        height: 180,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 3301,
        top: 360,
        left: 35,
        width: 290,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#CBD5E1',
        borderColor: '#CBD5E1',
        isEditMode: false,
      },
      {
        id: 3302,
        top: 460,
        left: 35,
        width: 290,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#CBD5E1',
        borderColor: '#CBD5E1',
        isEditMode: false,
      },
    ],
  },
  {
    id: '4001',
    title: 'Ստեղծագործ օրիգինալ',
    backgroundColor: '#FFF7ED',
    isEditMode: false,
    previewPath: 'document/template_picture_4.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 4101,
        top: 140,
        left: 100,
        width: 450,
        height: 110,
        rotation: 0,
        zIndex: 2,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Հրանտ Ստեփանյան',
        fontSize: 48,
        fontWeight: '700',
        color: '#9A3412',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 4102,
        top: 280,
        left: 100,
        width: 360,
        height: 80,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 35 տարեկան · <strong>Հեռախոս:</strong> +374 77 888 999 <strong>Էլ. փոստ:</strong> hrant.stepanyan@example.am`,
        fontSize: 13,
        fontWeight: '400',
        color: '#7C2D12',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 4103,
        top: 380,
        left: 100,
        width: 490,
        height: 160,
        rotation: 0,
        zIndex: 2,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Ստեղծագործ գրող և բովանդակության ռազմավար․ 10-ամյա փորձով՝ կազմել եմ պատմական, մշակութային և բիզնես ուղղվածության նյութեր։',
        fontSize: 17,
        fontWeight: '400',
        color: '#6B2F1C',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 4104,
        top: 570,
        left: 90,
        width: 520,
        height: 280,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Նախագծեր',
        content: `<strong>Գլխավոր նախագծեր</strong><br/>
  • "Մեր քաղաքը" քաղաքային պատմությունների հավաքածու՝ 15k ընթերցող<br/>
  • "Բիզնեսի լեզուն" մասնագիտական բլոգ՝ 40+ հոդվածներով<br/><br/>
  <strong>Աշխատանքային փորձ</strong><br/>
  <em>Բովանդակության ռազմավար · ContentHub · 2019 — ներկայում</em><br/>
  - Մշակել եմ բովանդակության ռազմավարություն 10+ բիզնեսի համար<br/>
  - Բարձրացրել եմ organic traffic-ը 250%-ով`,
        fontSize: 16,
        fontWeight: '400',
        color: '#6B2F1C',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 4105,
        top: 890,
        left: 90,
        width: 520,
        height: 160,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Լրագրություն և մասսայական հաղորդակցություն</strong><br/>
  ԵՊՀ Լրագրության ֆակուլտետ<br/>
  2009 — 2013<br/><br/>
  <strong>Հմտություններ</strong><br/>
  Content Strategy · SEO · Copywriting · Social Media Management`,
        fontSize: 15,
        fontWeight: '400',
        color: '#6B2F1C',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 4201,
        top: 115,
        left: 535,
        width: 150,
        height: 150,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 4301,
        top: 100,
        left: 520,
        width: 180,
        height: 180,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#FED7AA',
        borderColor: '#FB923C',
        isEditMode: false,
      },
      {
        id: 4302,
        top: 540,
        left: 80,
        width: 550,
        height: 4,
        rotation: 0,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundColor: '#FDBA74',
        borderColor: '#FDBA74',
        isEditMode: false,
      },
    ],
  },
  {
    id: '5001',
    title: 'Տեխնիկական մանրամասն',
    backgroundColor: '#F3F4F6',
    isEditMode: false,
    previewPath: 'document/template_picture_5.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 5101,
        top: 70,
        left: 80,
        width: 300,
        height: 90,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Նարեկ Մարտիրոսյան',
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 5102,
        top: 70,
        left: 480,
        width: 220,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 29 տարեկան<br/>
  <strong>Հեռախոս:</strong> +374 99 765 432<br/>
  <strong>Էլ. փոստ:</strong> narek.martirosyan@example.am<br/>
  <strong>GitHub:</strong> github.com/narek<br/>
  <strong>LinkedIn:</strong> linkedin.com/in/narek`,
        fontSize: 13,
        fontWeight: '400',
        color: '#1F2937',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 5103,
        top: 280,
        left: 80,
        width: 620,
        height: 320,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Senior Software Engineer</strong><br/>
  <em>CloudLayer · 2020 — ներկայում</em><br/>
  - Կառուցել եմ բարձրաբեռնված միկրոսերվիսներ (Go, Kubernetes)<br/>
  - Կազմել եմ CI/CD հոսքեր՝ GitHub Actions + ArgoCD<br/>
  - Նվազեցրել եմ response time-ը 60%-ով<br/><br/>
  <strong>Software Engineer</strong><br/>
  <em>NetBuild · 2016 — 2020</em><br/>
  - Աշխատել եմ Realtime համակարգերի վրա (Node.js + Redis)<br/>
  - Մշակել եմ REST և GraphQL API-ներ<br/>
  - Իրականացրել եմ database optimization, որը բարելավել է performance-ը 45%-ով`,
        fontSize: 14,
        fontWeight: '400',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 5104,
        top: 630,
        left: 80,
        width: 620,
        height: 220,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Տեղեկատվական Տեխնոլոգիաներ</strong><br/>
  ԵՊՀ · 2012 — 2016<br/>
  <em>Բակալավրի աստիճան, Գերազանցության դիպլոմ</em><br/><br/>
  <strong>Տեխնոլոգիաներ</strong><br/>
  Go · TypeScript · React · PostgreSQL · AWS · Terraform · Kafka · Docker · Kubernetes<br/><br/>
  <strong>Սերտիֆիկացիաներ</strong><br/>
  AWS Solutions Architect Associate · 2023 | CKA (Certified Kubernetes Administrator) · 2022`,
        fontSize: 14,
        fontWeight: '400',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 5201,
        top: 70,
        left: 300,
        width: 180,
        height: 180,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 5301,
        top: 250,
        left: 70,
        width: 650,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#D1D5DB',
        borderColor: '#D1D5DB',
        isEditMode: false,
      },
      {
        id: 5302,
        top: 600,
        left: 70,
        width: 650,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#D1D5DB',
        borderColor: '#D1D5DB',
        isEditMode: false,
      },
    ],
  },
  {
    id: '6001',
    title: 'Էլեգանտ մինիմալիստ',
    backgroundColor: '#FFFFFF',
    isEditMode: false,
    previewPath: 'document/template_picture_6.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 6101,
        top: 100,
        left: 120,
        width: 500,
        height: 100,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Լիլիթ Ավետիսյան',
        fontSize: 40,
        fontWeight: '700',
        color: '#0A0E27',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 6102,
        top: 220,
        left: 120,
        width: 500,
        height: 60,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>25 տարեկան</strong> · +374 98 234 567 · lilith.avetisyan@example.am`,
        fontSize: 13,
        fontWeight: '400',
        color: '#64748B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 6103,
        top: 320,
        left: 100,
        width: 540,
        height: 150,
        rotation: 0,
        zIndex: 1,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Մարկետինգի մասնագետ՝ մասնագիտացված թվային մարքեթինգում և բրենդավորման մեջ։ Սիրում եմ ստեղծել նորարարական մարքեթինգային ռազմավարություններ, որոնք բերում են փաստացի արդյունքներ։',
        fontSize: 15,
        fontWeight: '400',
        color: '#334155',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 6104,
        top: 510,
        left: 100,
        width: 540,
        height: 280,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Մարքեթինգի մենեջեր</strong><br/>
  <em>BrandLab · 2021 — ներկայում</em><br/>
  - Մշակել եմ մարքեթինգային ռազմավարություններ, որոնք ավելացրել են վաճառքը 45%-ով<br/>
  - Կառավարել եմ 5-հոգանոց թիմ և 500,000+ AMD ամսական բյուջե<br/><br/>
  <strong>Մարքեթինգի մասնագետ</strong><br/>
  <em>Digital Agency · 2019 — 2021</em><br/>
  - Իրականացրել եմ social media արշավներ, որոնք հասել են 2M+ հասարակության<br/>
  - Բարձրացրել եմ brand awareness-ը 120%-ով`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 6105,
        top: 830,
        left: 100,
        width: 540,
        height: 180,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Մարքեթինգ և Բիզնես</strong><br/>
  Հայաստանի Ամերիկյան Համալսարան<br/>
  2015 — 2019<br/>
  <em>Բակալավրի աստիճան, Magna Cum Laude</em><br/><br/>
  <strong>Հմտություններ</strong><br/>
  Digital Marketing · SEO/SEM · Google Analytics · Social Media Strategy · Brand Management`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 6301,
        top: 490,
        left: 100,
        width: 540,
        height: 1,
        rotation: 0,
        zIndex: 0,
        shapeType: 'line',
        backgroundColor: 'transparent',
        borderColor: '#E5E7EB',
        x2: 540,
        y2: 0,
        lineWidth: 1,
        isEditMode: false,
      },
      {
        id: 6302,
        top: 810,
        left: 100,
        width: 540,
        height: 1,
        rotation: 0,
        zIndex: 0,
        shapeType: 'line',
        backgroundColor: 'transparent',
        borderColor: '#E5E7EB',
        x2: 540,
        y2: 0,
        lineWidth: 1,
        isEditMode: false,
      },
    ],
  },
  {
    id: '7001',
    title: 'Գունավոր արդիական',
    backgroundColor: '#FEF3C7',
    isEditMode: false,
    previewPath: 'document/template_picture_7.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 7101,
        top: 60,
        left: 70,
        width: 450,
        height: 90,
        rotation: 0,
        zIndex: 2,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Դավիթ Սիմոնյան',
        fontSize: 42,
        fontWeight: '700',
        color: '#92400E',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 7102,
        top: 130,
        left: 70,
        width: 400,
        height: 100,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 27 տարեկան<br/>
  <strong>Հեռախոս:</strong> +374 95 555 666<br/>
  <strong>Էլ. փոստ:</strong> david.simonyan@example.am`,
        fontSize: 14,
        fontWeight: '400',
        color: '#78350F',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 7103,
        top: 300,
        left: 70,
        width: 580,
        height: 140,
        rotation: 0,
        zIndex: 2,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Frontend դեվելոպեր՝ մասնագիտացված React և Vue.js-ում։ Սիրում եմ ստեղծել գեղեցիկ և գործառական օգտատիրային ինտերֆեյսներ, որոնք ապահովում են լավ փորձառություն։',
        fontSize: 16,
        fontWeight: '400',
        color: '#78350F',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 7104,
        top: 480,
        left: 70,
        width: 580,
        height: 300,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Senior Frontend Developer</strong><br/>
  <em>TechStart · 2020 — ներկայում</em><br/>
  - Մշակել եմ React-based SPA-ներ՝ 100,000+ օգտատերով<br/>
  - Իրականացրել եմ component library, որը արագացրել է development-ը 40%-ով<br/>
  - Կատարել եմ code review և mentored 3 junior developers<br/><br/>
  <strong>Frontend Developer</strong><br/>
  <em>WebStudio · 2018 — 2020</em><br/>
  - Ստեղծել եմ responsive web applications Vue.js-ով<br/>
  - Իրականացրել եմ performance optimization, որը բարելավել է load time-ը 50%-ով`,
        fontSize: 15,
        fontWeight: '400',
        color: '#78350F',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 7105,
        top: 820,
        left: 70,
        width: 580,
        height: 200,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Տեղեկատվական Տեխնոլոգիաներ</strong><br/>
  Պոլիտեխնիկական Համալսարան<br/>
  2014 — 2018<br/><br/>
  <strong>Հմտություններ</strong><br/>
  React · Vue.js · TypeScript · Next.js · Tailwind CSS · Redux · GraphQL · Jest`,
        fontSize: 15,
        fontWeight: '400',
        color: '#78350F',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 7201,
        top: 55,
        left: 570,
        width: 150,
        height: 150,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 7301,
        top: 40,
        left: 50,
        width: 700,
        height: 180,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#FCD34D',
        borderColor: '#FCD34D',
        isEditMode: false,
      },
      {
        id: 7302,
        top: 460,
        left: 50,
        width: 620,
        height: 3,
        rotation: 0,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
        isEditMode: false,
      },
    ],
  },
  {
    id: '8001',
    title: 'Բիզնես կորպորատիվ',
    backgroundColor: '#FFFFFF',
    isEditMode: false,
    previewPath: 'document/template_picture_8.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 8101,
        top: 80,
        left: 80,
        width: 500,
        height: 85,
        rotation: 0,
        zIndex: 2,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Աննա Գրիգորյան',
        fontSize: 40,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 8102,
        top: 180,
        left: 80,
        width: 480,
        height: 80,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 31 տարեկան | <strong>Հեռախոս:</strong> +374 94 777 888 | <strong>Էլ. փոստ:</strong> anna.grigoryan@example.am`,
        fontSize: 13,
        fontWeight: '400',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 8103,
        top: 290,
        left: 80,
        width: 600,
        height: 130,
        rotation: 0,
        zIndex: 2,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Ֆինանսական վերլուծաբան՝ 8 տարվա փորձով բանկային և ներդրումային ոլորտում։ Մասնագիտացված եմ ֆինանսական մոդելավորման և ռիսկերի կառավարման մեջ։',
        fontSize: 15,
        fontWeight: '400',
        color: '#334155',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 8104,
        top: 460,
        left: 80,
        width: 600,
        height: 300,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Ֆինանսական վերլուծաբան</strong><br/>
  <em>Armenia Bank · 2019 — ներկայում</em><br/>
  - Վերլուծել եմ 100+ ներդրումային հնարավորություններ<br/>
  - Կառուցել եմ ֆինանսական մոդելներ, որոնք օգնել են նվազեցնել ռիսկերը 25%-ով<br/>
  - Ներկայացրել եմ հաշվետվություններ C-level մենեջմենթին<br/><br/>
  <strong>Ֆինանսական մասնագետ</strong><br/>
  <em>Investment Group · 2016 — 2019</em><br/>
  - Կատարել եմ due diligence 50+ ընկերությունների համար<br/>
  - Մշակել եմ ներդրումային առաջարկներ, որոնք բերել են 15M+ AMD`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 8105,
        top: 750,
        left: 80,
        width: 600,
        height: 200,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Ֆինանսներ և Հաշվապահություն</strong><br/>
  Հայաստանի Ամերիկյան Համալսարան<br/>
  2012 — 2016<br/>
  <em>Բակալավրի աստիճան, Dean's List</em><br/><br/>
  <strong>Հմտություններ</strong><br/>
  Financial Modeling · Excel · Bloomberg Terminal · Risk Analysis · CFA Level II`,
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 8201,
        top: 90,
        left: 570,
        width: 160,
        height: 160,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_WOMAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 8301,
        top: 70,
        left: 70,
        width: 680,
        height: 200,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#1E40AF',
        borderColor: '#1E40AF',
        isEditMode: false,
      },
      {
        id: 8302,
        top: 270,
        left: 70,
        width: 680,
        height: 5,
        rotation: 0,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        isEditMode: false,
      },
      {
        id: 8303,
        top: 430,
        left: 70,
        width: 680,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#CBD5E1',
        borderColor: '#CBD5E1',
        isEditMode: false,
      },
    ],
  },
  {
    id: '9001',
    title: 'Բակային նվազագույն',
    backgroundColor: '#FFFFFF',
    isEditMode: false,
    previewPath: 'document/template_picture_9.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 9101,
        top: 30,
        left: 220,
        width: 250,
        height: 80,
        rotation: 0,
        zIndex: 1,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Սյուզան Բաբայան',
        fontSize: 36,
        fontWeight: '700',
        color: '#0F172A',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 9102,
        top: 140,
        left: 190,
        width: 300,
        height: 60,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>24 տարեկան</strong> · +374 91 999 000<br/>
  suzan.babayan@example.am`,
        fontSize: 13,
        fontWeight: '400',
        color: '#64748B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 9103,
        top: 250,
        left: 60,
        width: 300,
        height: 700,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կողմ',
        content: `<strong>Հմտություններ</strong><br/>
  JavaScript<br/>
  Python<br/>
  React<br/>
  Node.js<br/>
  MongoDB<br/>
  AWS<br/><br/>
  <strong>Լեզուներ</strong><br/>
  Հայերեն (մայրենի)<br/>
  Անգլերեն (լավ)<br/>
  Ռուսերեն (լավ)<br/><br/>
  <strong>Սերտիֆիկացիաներ</strong><br/>
  AWS Certified Developer<br/>
  MongoDB Certified Developer`,
        fontSize: 14,
        fontWeight: '400',
        color: '#334155',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 9104,
        top: 250,
        left: 400,
        width: 330,
        height: 200,
        rotation: 0,
        zIndex: 1,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Full-stack դեվելոպեր՝ մասնագիտացված JavaScript և Python-ում։ Սիրում եմ ստեղծել scalable web applications, որոնք լուծում են բարդ բիզնես խնդիրներ։',
        fontSize: 15,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 9105,
        top: 480,
        left: 400,
        width: 330,
        height: 320,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Full-stack Developer</strong><br/>
  <em>StartupHub · 2021 — ներկայում</em><br/>
  - Մշակել եմ end-to-end web applications React և Node.js-ով<br/>
  - Նվազեցրել եմ server costs-ը 35%-ով cloud optimization-ի միջոցով<br/><br/>
  <strong>Junior Developer</strong><br/>
  <em>TechLab · 2019 — 2021</em><br/>
  - Մասնակցել եմ 10+ web projects-ի մշակմանը<br/>
  - Իրականացրել եմ unit tests, որը բարձրացրել է code quality-ն`,
        fontSize: 14,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 9106,
        top: 830,
        left: 400,
        width: 330,
        height: 160,
        rotation: 0,
        zIndex: 1,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Տեղեկատվական Տեխնոլոգիաներ</strong><br/>
  ԵՊՀ<br/>
  2015 — 2019<br/>
  <em>Բակալավրի աստիճան</em>`,
        fontSize: 14,
        fontWeight: '400',
        color: '#1E293B',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 9201,
        top: 40,
        left: 70,
        width: 120,
        height: 120,
        rotation: 0,
        zIndex: 2,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 9301,
        top: 40,
        left: 50,
        width: 3,
        height: 980,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#64748B',
        borderColor: '#64748B',
        isEditMode: false,
      },
      {
        id: 9302,
        top: 240,
        left: 50,
        width: 680,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#E2E8F0',
        borderColor: '#E2E8F0',
        isEditMode: false,
      },
      {
        id: 9303,
        top: 410,
        left: 60,
        width: 280,
        height: 2,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#E2E8F0',
        borderColor: '#E2E8F0',
        isEditMode: false,
      },
    ],
  },
  {
    id: '10001',
    title: 'Դինամիկ կենտրոնական',
    backgroundColor: '#F0F9FF',
    isEditMode: false,
    previewPath: 'document/template_picture_10.jpg',
    dimension: {
      format: 'a4',
      title: 'A4',
      width: 794,
      height: 1123,
      preview: { width: 248, height: 350 },
    },
    contentBlocks: [
      {
        id: 10101,
        top: 60,
        left: 50,
        width: 350,
        height: 90,
        rotation: 0,
        zIndex: 2,
        contentType: 'title',
        defaultContent: 'Անուն',
        content: 'Տիգրան Հակոբյան',
        fontSize: 42,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 10102,
        top: 200,
        left: 50,
        width: 410,
        height: 70,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կոնտակտ',
        content: `<strong>Տարիք:</strong> 30 տարեկան | <strong>Հեռախոս:</strong> +374 96 111 333<br/>
  <strong>Էլ. փոստ:</strong> tigran.hakobyan@example.am`,
        fontSize: 13,
        fontWeight: '400',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 10103,
        top: 310,
        left: 80,
        width: 630,
        height: 140,
        rotation: 0,
        zIndex: 2,
        contentType: 'description',
        defaultContent: 'Նկարագրություն',
        content:
          'Product Manager՝ 7 տարվա փորձով տեխնոլոգիական ընկերություններում։ Հավատում եմ, որ հաջող արտադրանքը սկսվում է խորը օգտատիրային հետազոտությունից և ավարտվում է հիանալի գործառականությամբ։',
        fontSize: 16,
        fontWeight: '400',
        color: '#0C4A6E',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'center',
        isEditMode: false,
      },
      {
        id: 10104,
        top: 490,
        left: 80,
        width: 630,
        height: 300,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Փորձ',
        content: `<strong>Senior Product Manager</strong><br/>
  <em>InnovateTech · 2020 — ներկայում</em><br/>
  - Ղեկավարել եմ 3-ամյա product roadmap-ը, որը բերել է 200% user growth<br/>
  - Համակարգել եմ cross-functional թիմ 12 մարդուց, ներառյալ engineers, designers, marketers<br/>
  - Ներդրել եմ user research processes, որոնք բարձրացրել են customer satisfaction-ը 40%-ով<br/><br/>
  <strong>Product Manager</strong><br/>
  <em>StartupXYZ · 2017 — 2020</em><br/>
  - Լաւնչել եմ նոր SaaS product-ը zero-ից մինչև 10,000+ օգտատեր<br/>
  - Մշակել եմ feature specifications և user stories`,
        fontSize: 15,
        fontWeight: '400',
        color: '#0C4A6E',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
      {
        id: 10105,
        top: 830,
        left: 80,
        width: 630,
        height: 200,
        rotation: 0,
        zIndex: 2,
        contentType: 'text',
        defaultContent: 'Կրթություն',
        content: `<strong>Բիզնես Վարչարարություն</strong><br/>
  Հայաստանի Ամերիկյան Համալսարան<br/>
  2013 — 2017<br/>
  <em>Մագիստրոսի աստիճան</em><br/><br/>
  <strong>Հմտություններ</strong><br/>
  Product Strategy · User Research · Agile/Scrum · Data Analysis · Figma · Jira · SQL`,
        fontSize: 15,
        fontWeight: '400',
        color: '#0C4A6E',
        backgroundColor: 'transparent',
        fontFamily: 'Inter',
        textAlign: 'left',
        isEditMode: false,
      },
    ],
    imageBlocks: [
      {
        id: 10201,
        top: 80,
        left: 500,
        width: 170,
        height: 170,
        rotation: 0,
        zIndex: 1,
        path: DEFAULT_MAN_IMAGE,
        isEditMode: false,
      },
    ],
    shapeBlocks: [
      {
        id: 10301,
        top: 60,
        left: 60,
        width: 680,
        height: 210,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#0EA5E9',
        borderColor: '#0EA5E9',
        isEditMode: false,
      },
      {
        id: 10302,
        top: 260,
        left: 60,
        width: 680,
        height: 5,
        rotation: 0,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundColor: '#38BDF8',
        borderColor: '#38BDF8',
        isEditMode: false,
      },
      {
        id: 10303,
        top: 470,
        left: 70,
        width: 620,
        height: 3,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#BAE6FD',
        borderColor: '#BAE6FD',
        isEditMode: false,
      },
    ],
  },
];

async function seedTemplates() {
  console.log('Starting template seeding...');

  const templatesToSeed = CV_TEMPLATES;

  if (templatesToSeed.length === 0) {
    console.warn(
      'No templates provided. Please pass templates array or load from frontend.',
    );
    return;
  }

  try {
    // Clear existing templates and their blocks
    await prisma.block.deleteMany({
      where: {
        templateId: { not: null },
      },
    });
    await prisma.documentTemplate.deleteMany({});

    for (const template of templatesToSeed) {
      // Create DocumentTemplate
      const createdTemplate = await prisma.documentTemplate.create({
        data: {
          title: template.title,
          previewPath: template.previewPath,
          styles: {
            backgroundColor: template.backgroundColor,
            isEditMode: template.isEditMode,
          },
          dimensions: template.dimension || null,
        } as any,
      });

      // Create content blocks
      if (template.contentBlocks && template.contentBlocks.length > 0) {
        for (const block of template.contentBlocks) {
          await prisma.block.create({
            data: {
              templateId: createdTemplate.id,
              blockType: BlockType.content,
              metadata: {
                // Only unique properties for content blocks
                content: block.content,
                contentType: block.contentType,
                defaultContent: block.defaultContent,
              },
              styles: {
                // All common styling properties
                top: block.top,
                left: block.left,
                width: block.width,
                height: block.height,
                rotation: block.rotation,
                zIndex: block.zIndex,
                fontSize: block.fontSize,
                fontWeight: block.fontWeight,
                color: block.color,
                backgroundColor: block.backgroundColor,
                fontFamily: block.fontFamily,
                textAlign: block.textAlign,
                textDecoration: block.textDecoration,
                fontStyle: block.fontStyle,
                isEditMode: block.isEditMode,
              },
            },
          });
        }
      }

      // Create image blocks
      if (template.imageBlocks && template.imageBlocks.length > 0) {
        for (const block of template.imageBlocks) {
          await prisma.block.create({
            data: {
              templateId: createdTemplate.id,
              blockType: BlockType.image,
              metadata: {
                // Only unique properties for image blocks
                path: block.path,
              },
              styles: {
                // All common styling properties
                top: block.top,
                left: block.left,
                width: block.width,
                height: block.height,
                rotation: block.rotation,
                zIndex: block.zIndex,
                isEditMode: block.isEditMode,
              },
            },
          });
        }
      }

      // Create shape blocks
      if (template.shapeBlocks && template.shapeBlocks.length > 0) {
        for (const block of template.shapeBlocks) {
          const shapeMetadata: any = {
            // Only unique properties for shape blocks
            shapeType: block.shapeType,
          };

          // Add shape-specific properties
          if (block.shapeType === 'circle' && block.radius) {
            shapeMetadata.radius = block.radius;
          }
          if (block.shapeType === 'line') {
            if (block.x2 !== undefined) shapeMetadata.x2 = block.x2;
            if (block.y2 !== undefined) shapeMetadata.y2 = block.y2;
            if (block.lineWidth !== undefined)
              shapeMetadata.lineWidth = block.lineWidth;
          }
          if (block.shapeType === 'triangle' && block.points) {
            shapeMetadata.points = block.points;
          }

          await prisma.block.create({
            data: {
              templateId: createdTemplate.id,
              blockType: BlockType.shape,
              metadata: shapeMetadata,
              styles: {
                // All common styling properties
                top: block.top,
                left: block.left,
                width: block.width,
                height: block.height,
                rotation: block.rotation,
                zIndex: block.zIndex,
                backgroundColor: block.backgroundColor,
                borderColor: block.borderColor,
                isEditMode: block.isEditMode,
              },
            },
          });
        }
      }

      console.log(`✓ Created template: ${template.title}`);
    }

    console.log('Template seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding templates:', error);
    throw error;
  }
}

if (require.main === module) {
  seedTemplates()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
