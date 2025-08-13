export type plans_data_type = {
  title: string;
  price: string;
  per: string;
  content: string;
  features: string[];
  selected: boolean;
  button: string;
}

export type TestimonialProps = {
  rating: number;
  statement: string;
  avatar: string;
  name: string;
  role: string;
};

export type FeatureCardProps = {
  content: string;
  title: string;
  icon: string;
};