export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  isTall: boolean;
  isCollapsible?: boolean;
}

export interface MethodStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  text: string;
}

export const site = {
  name: "Storm Automotive",
  legalName: "Storm Automotive",
  segment: "Oficina Mecânica Premium",
  city: "Ijuí",
  state: "RS",
  address: "Endereço completo sob confirmação, Ijuí – RS",
  postalCode: "",
  locationDisplay: "Ijuí – RS",
  phoneDisplay: "(55) 3333-2989",
  phoneRaw: "555533332989",
  whatsappUrl: "https://wa.me/555533332989?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento%20na%20Storm%20Automotive.",
  instagramUrl: "https://instagram.com/stormautomotive",
  instagramHandle: "@stormautomotive",
  facebookUrl: "https://facebook.com/stormautomotive",
  googleMapsUrl: "https://maps.google.com/?q=Storm+Automotive+Ijui+RS",
  email: "contato@stormautomotive.com.br",
  geo: {
    latitude: -28.390632575696802,
    longitude: -53.92477948730591,
  },
  seo: {
    title: "Storm Automotive | Oficina Mecânica Premium em Ijuí–RS",
    description: "Oficina mecânica de alta precisão e padrão premium em Ijuí–RS. Diagnóstico computadorizado, revisão preventiva e manutenção automotiva especializada.",
    url: "https://stormautomotive.vercel.app/",
    ogImage: "https://stormautomotive.vercel.app/assets/images/storm/hero-oficina-storm-hq.png",
  },
  assets: {
    logo: "https://stormautomotive.vercel.app/assets/images/storm/logo-storm.png",
    favicon: "https://stormautomotive.vercel.app/assets/images/storm/favicon.png",
    hero: "https://stormautomotive.vercel.app/assets/images/storm/hero-oficina-storm-hq.png",
  },
} as const;

export const services: readonly ServiceItem[] = [
  {
    id: "revisao-preventiva",
    title: "REVISÃO\nPREVENTIVA",
    description: "Mais segurança,\nmais quilometragem para a\nsua história.",
    image: "https://stormautomotive.vercel.app/assets/images/storm/servico-revisao-preventiva-hq.png",
    alt: "Revisão preventiva especializada com técnico inspecionando motor",
    isTall: true,
  },
  {
    id: "diagnostico-eletronico",
    title: "DIAGNÓSTICO\nELETRÔNICO",
    description: "Tecnologia para\nidentificar e resolver\ncom precisão.",
    image: "https://stormautomotive.vercel.app/assets/images/storm/servico-diagnostico-eletronico-hq.png",
    alt: "Scanner e diagnóstico eletrônico computadorizado de última geração",
    isTall: false,
  },
  {
    id: "manutencao-especializada",
    title: "MANUTENÇÃO\nESPECIALIZADA",
    description: "Do motor ao sistema de freios, com alto\npadrão técnico.",
    image: "https://stormautomotive.vercel.app/assets/images/storm/servico-manutencao-especializada-hq.png",
    alt: "Manutenção especializada em sistema de freios e componentes mecânicos",
    isTall: false,
    isCollapsible: true,
  },
  {
    id: "ar-condicionado",
    title: "AR-CONDICIONADO",
    description: "Conforto térmico\nem todas as estações\ndo ano.",
    image: "https://stormautomotive.vercel.app/assets/images/storm/servico-ar-condicionado-hq.png",
    alt: "Manutenção de sistema de ar-condicionado e climatização veicular",
    isTall: true,
    isCollapsible: true,
  },
] as const;

export const methodSteps: readonly MethodStep[] = [
  {
    number: "01",
    title: "DIAGNÓSTICO\nPRECISO",
    description: "Análise completa com tecnologia de ponta e olhar técnico especializado.",
    icon: "search",
  },
  {
    number: "02",
    title: "APROVAÇÃO\nTRANSPARENTE",
    description: "Você recebe o orçamento detalhado e aprova somente o que for necessário.",
    icon: "file-text",
  },
  {
    number: "03",
    title: "SERVIÇO COM\nPADRÃO TÉCNICO",
    description: "Execução por profissionais qualificados, com foco na qualidade e no seu bem-estar.",
    icon: "tool",
  }
] as const;

export const testimonials: readonly TestimonialItem[] = [
  {
    id: "1",
    name: "Carlos Eduardo Mendes",
    city: "Cliente Storm Automotive, Ijuí - RS",
    text: "Atendimento diferenciado, serviço de qualidade e total transparência. Levo meus veículos na Storm há anos e sempre saio tranquilo, sabendo que estão em boas mãos.",
  }
] as const;

export const faqs = [];
