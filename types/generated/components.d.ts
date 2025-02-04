import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsContactsSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts_sections';
  info: {
    description: '';
    displayName: 'Contacts Section';
  };
  attributes: {
    description: Schema.Attribute.String;
    phone_numbers: Schema.Attribute.Component<'shared.phone-number', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeaturesSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_features_sections';
  info: {
    description: '';
    displayName: 'Features Section';
    icon: 'information';
  };
  attributes: {
    features_list: Schema.Attribute.Component<'shared.features-list', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeaderSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_header_sections';
  info: {
    displayName: 'header-section';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    hero_image: Schema.Attribute.Media<'images' | 'files'>;
    hero_tagline: Schema.Attribute.String;
  };
}

export interface SectionsSliderSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_slider_sections';
  info: {
    description: '';
    displayName: 'Slider Section';
    icon: 'picture';
  };
  attributes: {
    slider_images: Schema.Attribute.Component<
      'shared.truck-in-action-slider',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTransportableItems extends Struct.ComponentSchema {
  collectionName: 'components_sections_transportable_items';
  info: {
    description: '';
    displayName: 'Transportable Items';
  };
  attributes: {
    title: Schema.Attribute.String;
    transportable_items_list: Schema.Attribute.Component<
      'shared.trasportable-items-list',
      true
    >;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary', 'link']>;
    url: Schema.Attribute.String;
  };
}

export interface SharedFeatIcon extends Struct.ComponentSchema {
  collectionName: 'components_shared_feat_icons';
  info: {
    description: '';
    displayName: 'FeatIcon';
  };
  attributes: {
    feature_icon: Schema.Attribute.Relation<
      'oneToOne',
      'api::feature-icon.feature-icon'
    >;
    svg64_svg64: Schema.Attribute.Text;
  };
}

export interface SharedFeaturesList extends Struct.ComponentSchema {
  collectionName: 'components_shared_features_lists';
  info: {
    description: '';
    displayName: 'Features List';
  };
  attributes: {
    feature_icon: Schema.Attribute.Relation<
      'oneToOne',
      'api::feature-icon.feature-icon'
    >;
    feature_text: Schema.Attribute.String;
  };
}

export interface SharedPhoneNumber extends Struct.ComponentSchema {
  collectionName: 'components_shared_phone_numbers';
  info: {
    displayName: 'phone_number';
    icon: 'phone';
  };
  attributes: {
    phone_number: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSilderImages extends Struct.ComponentSchema {
  collectionName: 'components_shared_silder_images';
  info: {
    displayName: 'Silder Images';
  };
  attributes: {};
}

export interface SharedSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_medias';
  info: {
    displayName: 'Social Media';
  };
  attributes: {
    icon: Schema.Attribute.String;
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedTrasportableItemsList extends Struct.ComponentSchema {
  collectionName: 'components_shared_trasportable_items_lists';
  info: {
    description: '';
    displayName: 'Transportable Items List';
  };
  attributes: {
    transportable_item_media: Schema.Attribute.Relation<
      'oneToOne',
      'api::transportable-item-icon.transportable-item-icon'
    >;
    transportable_item_title: Schema.Attribute.String;
  };
}

export interface SharedTruckInActionSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_truck_in_action_sliders';
  info: {
    displayName: 'Truck In Action Slider';
    icon: 'picture';
  };
  attributes: {
    localized_alt_text: Schema.Attribute.String;
    slider_image: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.contacts-section': SectionsContactsSection;
      'sections.features-section': SectionsFeaturesSection;
      'sections.header-section': SectionsHeaderSection;
      'sections.hero-section': SectionsHeroSection;
      'sections.slider-section': SectionsSliderSection;
      'sections.transportable-items': SectionsTransportableItems;
      'shared.button': SharedButton;
      'shared.feat-icon': SharedFeatIcon;
      'shared.features-list': SharedFeaturesList;
      'shared.phone-number': SharedPhoneNumber;
      'shared.seo': SharedSeo;
      'shared.silder-images': SharedSilderImages;
      'shared.social-media': SharedSocialMedia;
      'shared.trasportable-items-list': SharedTrasportableItemsList;
      'shared.truck-in-action-slider': SharedTruckInActionSlider;
    }
  }
}
